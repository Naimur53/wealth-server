import {
  CurrencyRequest,
  EStatusOfCurrencyRequest,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { currencyRequestSearchableFields } from './currencyRequest.constant';
import { ICurrencyRequestFilters } from './currencyRequest.interface';

const getAllCurrencyRequest = async (
  filters: ICurrencyRequestFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<CurrencyRequest[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = currencyRequestSearchableFields.map(single => {
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

  const whereConditions: Prisma.CurrencyRequestWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.currencyRequest.findMany({
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
  const total = await prisma.currencyRequest.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCurrencyRequest = async (
  payload: CurrencyRequest
): Promise<CurrencyRequest | null> => {
  const newCurrencyRequest = await prisma.currencyRequest.create({
    data: payload,
    include: {
      ownBy: true,
    },
  });
  return newCurrencyRequest;
};

const getSingleCurrencyRequest = async (
  id: string
): Promise<CurrencyRequest | null> => {
  const result = await prisma.currencyRequest.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateCurrencyRequest = async (
  id: string,
  payload: Partial<CurrencyRequest>
): Promise<CurrencyRequest | null> => {
  // check is already status is approved?
  const queryData = await prisma.currencyRequest.findFirst({ where: { id } });
  if (!queryData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found!');
  }
  if (queryData.status === EStatusOfCurrencyRequest.approved) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already approved!');
  }
  if (payload.status === EStatusOfCurrencyRequest.approved) {
    // start updating
    const updatedCurrencyRequest = await prisma.$transaction(async tx => {
      const result = await tx.currencyRequest.update({
        where: {
          id,
        },
        data: payload,
      });
      // get previous currency
      const previousCurrency = await tx.currency.findFirst({
        where: { ownById: result.ownById },
      });
      if (!previousCurrency) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User currency not found');
      }
      // update currency
      const newAddedAmount = result.amount * config.currencyPerDollar;
      const newAmount = previousCurrency.amount + newAddedAmount;

      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const updateCurrency = await tx.currency.update({
        where: { ownById: result.ownById },
        data: { amount: newAmount },
      });
      const queryUser = await prisma.user.findUnique({
        where: { id: queryData.ownById },
      });
      if (!queryUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
      }
      await sendEmail(
        { to: queryUser?.email as string },
        {
          subject: EmailTemplates.confirmEmailForCurrencyPurchase.subject,
          html: EmailTemplates.confirmEmailForCurrencyPurchase.html({
            currencyAmount: newAddedAmount,
            currentAmount: newAmount,
          }),
        }
      );
      return result;
    });
    return updatedCurrencyRequest;
  } else {
    const result = await prisma.currencyRequest.update({
      where: {
        id,
      },
      data: payload,
    });
    return result;
  }
};

const deleteCurrencyRequest = async (
  id: string
): Promise<CurrencyRequest | null> => {
  const result = await prisma.currencyRequest.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CurrencyRequest not found!');
  }
  return result;
};

export const CurrencyRequestService = {
  getAllCurrencyRequest,
  createCurrencyRequest,
  updateCurrencyRequest,
  getSingleCurrencyRequest,
  deleteCurrencyRequest,
};
