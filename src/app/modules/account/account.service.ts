import { Account, Prisma, UserRole } from '@prisma/client';
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

  const { searchTerm, maxPrice, minPrice, ...filterData } = filters;

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
  if (maxPrice) {
    andCondition.push({
      price: {
        lte: Number(maxPrice),
      },
    });
  }
  if (minPrice) {
    andCondition.push({
      price: {
        gte: Number(minPrice),
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyChecker = (data: any, key: string): any => {
    const keysToCheck = ['isSold'];
    if (keysToCheck.includes(key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return JSON.parse((filterData as any)[key]);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (filterData as any)[key];
  };
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: keyChecker(filterData, key),
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
      accountType: true,
      preview: true,
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

  const isAccountOwnerExits = await prisma.user.findUnique({
    where: { id: payload.ownById },
  });
  if (!isAccountOwnerExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (
    isAccountOwnerExits.role === UserRole.seller &&
    !isAccountOwnerExits.isApprovedForSeller
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your are not approved as seller'
    );
  }
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
): Promise<Omit<Account, 'username' | 'password'> | null> => {
  const isAccountExits = await prisma.account.findUnique({ where: { id } });

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found!');
  }
  if (isAccountExits.isSold) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "sold account can't be updated!"
    );
  }
  const result = await prisma.account.update({
    where: {
      id,
    },
    data: payload,
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { username, password, ...rest } = result;
  return rest;
};

const deleteAccount = async (
  id: string
): Promise<Omit<Account, 'username' | 'password'> | null> => {
  const isAccountExits = await prisma.account.findUnique({ where: { id } });

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found!');
  }
  if (isAccountExits.isSold) {
    throw new ApiError(httpStatus.BAD_REQUEST, "sold account can't be delete!");
  }
  const result = await prisma.account.delete({
    where: { id },
  });
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { username, password, ...rest } = result;
  return rest;
};

export const AccountService = {
  getAllAccount,
  createAccount,
  updateAccount,
  getSingleAccount,
  deleteAccount,
};
