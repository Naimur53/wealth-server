import { Cart, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { cartSearchableFields } from './cart.constant';
import { ICartFilters } from './cart.interface';

const getAllCart = async (
  filters: ICartFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Cart[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = cartSearchableFields.map(single => {
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

  const whereConditions: Prisma.CartWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.cart.findMany({
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
  const total = await prisma.cart.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCart = async (
  userId: string,
  payload: Cart
): Promise<Cart | null> => {
  // check is cart already exits
  const isCartExist = await prisma.cart.findFirst({
    where: {
      ownById: userId,
      accountId: payload.accountId,
    },
  });
  if (isCartExist?.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cart already exits');
  }
  const newCart = await prisma.cart.create({
    data: payload,
    include: {
      account: true,
      ownBy: true,
    },
  });
  return newCart;
};

const getSingleUserCarts = async (userId: string): Promise<Cart[] | null> => {
  const result = await prisma.cart.findMany({
    where: {
      ownById: userId,
    },
    include: {
      account: true,
      ownBy: true,
    },
  });
  return result;
};
const getSingleCart = async (id: string): Promise<Cart | null> => {
  const result = await prisma.cart.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateCart = async (
  id: string,
  payload: Partial<Cart>
): Promise<Cart | null> => {
  const result = await prisma.cart.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteCart = async (id: string): Promise<Cart | null> => {
  const result = await prisma.cart.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found!');
  }
  return result;
};

export const CartService = {
  getAllCart,
  createCart,
  updateCart,
  getSingleCart,
  deleteCart,
  getSingleUserCarts,
};
