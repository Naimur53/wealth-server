import { Orders, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
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
  const newOrders = await prisma.orders.create({
    data: payload,
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
};
