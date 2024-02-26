import { EOrderPaymentType, FlippingOrders, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { flippingOrdersSearchableFields } from './flippingOrders.constant';
import { IFlippingOrdersFilters } from './flippingOrders.interface';

const getAllFlippingOrders = async (
  filters: IFlippingOrdersFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<FlippingOrders[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = flippingOrdersSearchableFields.map(single => {
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

  const whereConditions: Prisma.FlippingOrdersWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.flippingOrders.findMany({
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
  const total = await prisma.flippingOrders.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createFlippingOrders = async (
  payload: FlippingOrders
): Promise<FlippingOrders | null> => {
  // is
  const isFlippingExits = await prisma.property.findUnique({
    where: { id: payload.flippingId },
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
  if (!isFlippingExits) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Property does not exist to orders'
    );
  }
  const newFlippingOrders = await prisma.flippingOrders.create({
    data: payload,
  });
  return newFlippingOrders;
};

const getSingleFlippingOrders = async (
  id: string
): Promise<FlippingOrders | null> => {
  const result = await prisma.flippingOrders.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateFlippingOrders = async (
  id: string,
  payload: Partial<FlippingOrders>
): Promise<FlippingOrders | null> => {
  const result = await prisma.flippingOrders.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFlippingOrders = async (
  id: string
): Promise<FlippingOrders | null> => {
  const result = await prisma.flippingOrders.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FlippingOrders not found!');
  }
  return result;
};

export const FlippingOrdersService = {
  getAllFlippingOrders,
  createFlippingOrders,
  updateFlippingOrders,
  getSingleFlippingOrders,
  deleteFlippingOrders,
};
