import { Currency, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { currencySearchableFields } from './currency.constant';
import { ICurrencyFilters } from './currency.interface';

const getAllCurrency = async (
  filters: ICurrencyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Currency[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = currencySearchableFields.map(single => {
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

  const whereConditions: Prisma.CurrencyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.currency.findMany({
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
  const total = await prisma.currency.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCurrency = async (payload: Currency): Promise<Currency | null> => {
  const newCurrency = await prisma.currency.create({
    data: payload,
  });
  return newCurrency;
};

const getSingleCurrency = async (id: string): Promise<Currency | null> => {
  const result = await prisma.currency.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateCurrency = async (
  id: string,
  payload: Partial<Currency>
): Promise<Currency | null> => {
  const result = await prisma.currency.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteCurrency = async (id: string): Promise<Currency | null> => {
  const result = await prisma.currency.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found!');
  }
  return result;
};

export const CurrencyService = {
  getAllCurrency,
  createCurrency,
  updateCurrency,
  getSingleCurrency,
  deleteCurrency,
};
