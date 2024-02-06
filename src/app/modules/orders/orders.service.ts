import { EApprovedForSale, Orders, Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { round } from 'lodash';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { ordersSearchableFields } from './orders.constant';
import { IOrdersFilters } from './orders.interface';

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
  console.log('makking ', payload);
  const isAccountExits = await prisma.account.findUnique({
    where: {
      id: payload.accountId,
      approvedForSale: EApprovedForSale.approved,
    },
  });

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  // check user exits and dose user have enough currency to buy

  const isUserExist = await prisma.user.findUnique({
    where: { id: payload.orderById },
    select: {
      id: true,
      email: true,
      Currency: { select: { amount: true, id: true } },
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  //check buyer is not the the owner of this account

  if (isAccountExits.ownById === isUserExist.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Account owner can not buy their account !'
    );
  }
  // check is account already sold

  if (isAccountExits.isSold) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This account already sold');
  }
  // get seller info
  const isSellerExist = await prisma.user.findUnique({
    where: { id: isAccountExits.ownById },
    select: {
      id: true,
      email: true,
      role: true,
      Currency: { select: { amount: true, id: true } },
    },
  });
  console.log('seller', isSellerExist);

  // the only 10 percent will receive by admin and expect the 10 percent seller will receive
  // get admin info
  const isAdminExist = await prisma.user.findFirst({
    where: { email: config.mainAdminEmail },
    select: {
      id: true,
      email: true,
      Currency: { select: { amount: true, id: true } },
    },
  });
  if (!isUserExist?.Currency?.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this user!'
    );
  }
  const serviceCharge =
    (config.accountSellServiceCharge / 100) * isAccountExits.price;
  const amountToCutFromTheBuyer = serviceCharge + isAccountExits.price;
  if (amountToCutFromTheBuyer < isAccountExits.price) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Not enough currency left to by this account!'
    );
  }
  if (!isSellerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }
  if (!isSellerExist?.Currency?.amount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this seller!'
    );
  }
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
    // return
  }
  if (!isAdminExist.Currency?.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this seller!'
    );
  }
  //
  const adminFee = (config.accountSellPercentage / 100) * isAccountExits.price;
  const sellerReceive = isAccountExits.price - adminFee;
  const userAmount = round(
    isUserExist.Currency.amount - amountToCutFromTheBuyer,
    config.calculationMoneyRound
  );
  const sellerCAmount = round(
    isSellerExist.Currency.amount + sellerReceive,
    config.calculationMoneyRound
  );
  const newAmountForAdmin =
    isSellerExist.role === UserRole.admin
      ? round(
          isAdminExist.Currency.amount + isAccountExits.price,
          config.calculationMoneyRound
        )
      : round(
          isAdminExist.Currency.amount + adminFee,
          config.calculationMoneyRound
        );
  const data = await prisma.$transaction(async tx => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const removeCurrencyFromUser = await tx.currency.update({
      where: { ownById: isUserExist.id },
      data: {
        amount: userAmount,
      },
    });
    console.log('remove from user', removeCurrencyFromUser);
    if (isSellerExist.role === UserRole.admin) {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToAdmin = await tx.currency.update({
        where: { ownById: isAdminExist.id },
        data: {
          amount: newAmountForAdmin,
        },
      });
    } else {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToSeller = await tx.currency.update({
        where: { ownById: isAccountExits.ownById },
        data: {
          amount: sellerCAmount,
        },
      });
      console.log('add to seller', addCurrencyToSeller);

      console.log({ newAmountForAdmin });
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToAdmin = await tx.currency.update({
        where: { ownById: isAdminExist.id },
        data: {
          amount: newAmountForAdmin,
        },
      });
    }
    //changer status of account is sold
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const update = await tx.account.update({
      where: { id: payload.accountId },
      data: { isSold: true },
    });
    console.log({ payload });
    const newOrders = await tx.orders.create({
      data: payload,
    });

    if (!newOrders) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'dffdfdf');
    }
    return newOrders;
  });
  sendEmail(
    { to: isUserExist.email },
    {
      subject: EmailTemplates.orderSuccessful.subject,
      html: EmailTemplates.orderSuccessful.html({
        accountName: isAccountExits.name,
        accountPassword: isAccountExits.password,
        accountUserName: isAccountExits.username,
      }),
    }
  );
  await prisma.cart.deleteMany({
    where: {
      AND: [
        { accountId: isAccountExits.id },
        { ownById: isUserExist.id },
        // Add more conditions if needed
      ],
    },
  });
  return data;
};

const getSingleOrders = async (id: string): Promise<Orders | null> => {
  const result = await prisma.orders.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const getMyOrders = async (id: string): Promise<Orders[] | null> => {
  console.log({ id });
  const result = await prisma.orders.findMany({
    where: {
      orderById: id,
    },
    include: {
      account: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const updateOrders = async (
  id: string,
  payload: Partial<Orders>
): Promise<Orders | null> => {
  const result = await prisma.orders.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteOrders = async (id: string): Promise<Orders | null> => {
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
  getMyOrders,
};
