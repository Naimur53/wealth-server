import {
  EOrderPaymentType,
  EOrderRefName,
  EOrderStatus,
  EPropertyStatus,
  Orders,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ordersSearchableFields } from './orders.constant';
import { IOrdersFilters } from './orders.interface';
import { multiHandler } from './orders.multiHandler';

const getAllOrders = async (
  filters: IOrdersFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Orders[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = ordersSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.OrdersWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.orders.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.orders.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createOrders = async (payload: Orders): Promise<Orders | null> => {
  const refName = payload.refName;
  let amount;
  let isExits;

  const isOrderAlreadyExist = await prisma.orders.findFirst({
    where: {
      orderById: payload.orderById,
      refName: refName,
      status: 'pending',
      crowdFundId: payload.crowdFundId,
      propertyId: payload.propertyId,
      flippingId: payload.flippingId,
    },
  });
  if (isOrderAlreadyExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Already order this item wait form confirmation'
    );
  }
  // if wealBank exits
  if (payload.wealthBankId) {
    const isBankIdExits = await prisma.bank.findUnique({
      where: { id: payload.wealthBankId },
    });
    if (!isBankIdExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Bank id is not valid');
    }
  }

  // for crowd Fund
  if (refName === EOrderRefName.crowdFund) {
    if (!payload.crowdFundId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'crowFund id is required');
    }
    isExits = await prisma.crowdFund.findUnique({
      where: { id: payload.crowdFundId },
    });
  }
  // for flipping
  else if (refName === EOrderRefName.flipping) {
    if (!payload.flippingId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'flipping id is required');
    }
    isExits = await prisma.flipping.findUnique({
      where: { id: payload.flippingId },
    });
    amount = isExits?.price;
  }

  // for flipping
  else if (refName === EOrderRefName.property) {
    if (!payload.propertyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'property id is required');
    }
    isExits = await prisma.property.findUnique({
      where: { id: payload.propertyId },
    });
    amount = isExits?.price;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
  if (payload.paymentType === EOrderPaymentType.manual) {
    // send a email to notify admin
  }
  if (!isExits) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${refName} does not exist to orders`
    );
  }

  if (!amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount not found!');
  }
  // create pay stack url and add it
  const newOrders = await prisma.orders.create({
    data: {
      ...payload,
      amount,
    },
  });
  return newOrders;
};

const getSingleOrders = async (id: string): Promise<Orders | null> => {
  const result = await prisma.orders.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOrders = async (
  id: string,
  payload: Partial<Orders>
): Promise<Orders | null> => {
  // check is property exits
  const isOrderExits = await prisma.orders.findUnique({
    where: { id },
  });
  if (payload.refName) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'You can not update');
  }
  if (!isOrderExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found ');
  }
  const refName = isOrderExits.refName;
  const isOrderPending = isOrderExits.status === EOrderStatus.pending;
  const isNewStatusIsSuccess = payload.status === EOrderStatus.success;

  if (isNewStatusIsSuccess && isOrderPending) {
    // check product is sold or not
    const isExits = await multiHandler.findUniqueEntity(refName, {
      crowdFundId: isOrderExits.crowdFundId || '',
      flippingId: isOrderExits.flippingId || '',
      propertyId: isOrderExits.propertyId || '',
    });
    if (!isExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${refName} is not found!`);
    }
    if (isExits.status === 'sold') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Items already sold');
    }

    const output = await prisma.$transaction(async tx => {
      // crowd fund
      if (refName === EOrderRefName.crowdFund) {
        if (!isOrderExits.crowdFundId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'crowFund id is required');
        }
        const preCrowdFund = await tx.crowdFund.findUnique({
          where: { id: isOrderExits.crowdFundId },
        });
        if (!preCrowdFund) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Crowdfund not found');
        }
        const newRaise = preCrowdFund.fundRaised + isOrderExits.amount;
        let status: EPropertyStatus = preCrowdFund.status;
        if (newRaise > preCrowdFund.targetFund) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Amount is not valid');
        } else if (newRaise === isOrderExits.amount) {
          status = 'sold';
        }
        // check is
        const newFund = await tx.crowdFund.update({
          where: { id: isOrderExits.crowdFundId },
          data: {
            status,
            fundRaised: { increment: isOrderExits.amount },
          },
        });
        if (newFund.fundRaised > newFund.targetFund) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Not enough fund left to buy!'
          );
        }
      }
      // for flipping
      else if (refName === EOrderRefName.flipping) {
        if (!isOrderExits.flippingId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'flipping id is required');
        }
        await tx.flipping.update({
          where: { id: isOrderExits.flippingId },
          data: { status: EPropertyStatus.sold },
        });
      }
      // for property
      else if (refName === EOrderRefName.property) {
        if (!isOrderExits.propertyId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'property id is required');
        }
        await tx.property.update({
          where: { id: isOrderExits.propertyId },
          data: { status: EPropertyStatus.sold },
        });
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
      }
      return await tx.orders.update({ where: { id }, data: payload });
    });
    return output;
  } else {
    const result = await prisma.orders.update({
      where: {
        id,
      },
      data: payload,
    });
    return result;
  }
};

const deleteOrders = async (id: string): Promise<Orders | null> => {
  const isOrderExits = await prisma.orders.findUnique({
    where: { id },
  });
  if (!isOrderExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }
  if (isOrderExits.status === EOrderStatus.success) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Status is success you can not delete data'
    );
  }
  const result = await prisma.orders.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Orders not found!');
  }
  return result;
};
export const OrdersService = {
  getAllOrders,
  createOrders,
  updateOrders,
  getSingleOrders,
  deleteOrders,
};
