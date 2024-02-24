import {
  EOrderPaymentType,
  EOrderStatus,
  EPropertyStatus,
  Prisma,
  PropertyOrders,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { propertyOrdersSearchableFields } from './propertyOrders.constant';
import { IPropertyOrdersFilters } from './propertyOrders.interface';

const getAllPropertyOrders = async (
  filters: IPropertyOrdersFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<PropertyOrders[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = propertyOrdersSearchableFields.map(single => {
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

  const whereConditions: Prisma.PropertyOrdersWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.propertyOrders.findMany({
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
  const total = await prisma.propertyOrders.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createPropertyOrders = async (
  payload: PropertyOrders
): Promise<PropertyOrders | null> => {
  const isPropertyExits = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });
  // if wealBank exits
  if (payload.wealthBankId) {
    const isBankIdExits = await prisma.bank.findUnique({
      where: { id: payload.wealthBankId },
    });
    if (!isBankIdExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Bank id is not valid');
    }
  }
  if (payload.paymentType === EOrderPaymentType.manual) {
    // send a email to notify admin
  }
  if (!isPropertyExits) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Property does not exist to orders'
    );
  }

  // create pay stack url and add it
  const newPropertyOrders = await prisma.propertyOrders.create({
    data: payload,
  });
  return newPropertyOrders;
};

const getSinglePropertyOrders = async (
  id: string
): Promise<PropertyOrders | null> => {
  const result = await prisma.propertyOrders.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updatePropertyOrders = async (
  id: string,
  payload: Partial<PropertyOrders>
): Promise<PropertyOrders | null> => {
  // check is property exits
  const isOrderExits = await prisma.propertyOrders.findUnique({
    where: { id },
  });
  if (!isOrderExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found ');
  }
  const isOrderPending = isOrderExits.status === EOrderStatus.pending;
  const isNewStatusIsSuccess = payload.status === EOrderStatus.success;
  if (isNewStatusIsSuccess && isOrderPending) {
    const output = await prisma.$transaction(async tx => {
      // update property
      await tx.property.update({
        where: { id: isOrderExits.propertyId },
        data: { status: EPropertyStatus.sold },
      });
      return await tx.propertyOrders.update({ where: { id }, data: payload });
    });
    return output;
  } else {
    const result = await prisma.propertyOrders.update({
      where: {
        id,
      },
      data: payload,
    });
    return result;
  }
};

const deletePropertyOrders = async (
  id: string
): Promise<PropertyOrders | null> => {
  const isOrderExits = await prisma.propertyOrders.findUnique({
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
  const result = await prisma.propertyOrders.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PropertyOrders not found!');
  }
  return result;
};

export const PropertyOrdersService = {
  getAllPropertyOrders,
  createPropertyOrders,
  updatePropertyOrders,
  getSinglePropertyOrders,
  deletePropertyOrders,
};
