import { Account, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { accountSearchableFields } from './account.constant';
import { IAccountFilters } from './account.interface';

const getAllAccount = async (
  filters: IAccountFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Omit<Account, 'username' | 'password'>[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = accountSearchableFields.map(single => {
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

  const whereConditions: Prisma.AccountWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.account.findMany({
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
    select: {
      id: true,
      category: true,
      approvedForSale: true,
      description: true,
      createdAt: true,
      isSold: true,
      Cart: true,
      name: true,
      price: true,
      updatedAt: true,
      ownById: true,
      ownBy: {
        select: {
          name: true,
          profileImg: true,
          email: true,
          id: true,
          isVerified: true,
        },
      },
    },
  });
  const total = await prisma.account.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createAccount = async (payload: Account): Promise<Account | null> => {
  console.log(payload);
  const newAccount = await prisma.account.create({
    data: payload,
  });
  return newAccount;
};

const getSingleAccount = async (id: string): Promise<Account | null> => {
  const result = await prisma.account.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAccount = async (
  id: string,
  payload: Partial<Account>
): Promise<Account | null> => {
  console.log(payload);
  const result = await prisma.account.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteAccount = async (id: string): Promise<Account | null> => {
  const result = await prisma.account.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found!');
  }
  return result;
};

export const AccountService = {
  getAllAccount,
  createAccount,
  updateAccount,
  getSingleAccount,
  deleteAccount,
};
