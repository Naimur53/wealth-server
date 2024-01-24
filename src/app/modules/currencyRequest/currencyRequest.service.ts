import {
  CurrencyRequest,
  EStatusOfCurrencyRequest,
  Prisma,
} from '@prisma/client';
import axios from 'axios';
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
import {
  ICreateCurrencyRequestRes,
  ICurrencyRequestFilters,
} from './currencyRequest.interface';

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
const createCurrencyRequestInvoice = async (
  payload: CurrencyRequest
): Promise<ICreateCurrencyRequestRes | null> => {
  const newCurrencyRequest = await prisma.currencyRequest.create({
    data: { ...payload, status: EStatusOfCurrencyRequest.pending },
    include: {
      ownBy: true,
    },
  });
  if (!newCurrencyRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Invoie');
  }
  const nowPaymentsApiKey = config.nowPaymentApiKey || ''; // Use your sandbox API key

  // Use the sandbox API URL
  const sandboxApiUrl = 'https://api-sandbox.nowpayments.io/v1/invoice';

  // Create an invoice using the NowPayments sandbox API
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  console.log({ nowPaymentsApiKey });
  // const api = new NOWPaymentsApi({ apiKey: nowPaymentsApiKey });
  const invoice = {
    price_amount: payload.amount,
    price_currency: 'USD',
    order_id: newCurrencyRequest.id,
    pay_currency: 'BTC', // Specify the cryptocurrency to accept (e.g., BTC)
    ipn_callback_url:
      'https://acctbazzar-server.vercel.app/api/v1/currency-request/nowpayments-ipn', // Specify your IPN callback URL
    // api_key: nowPaymentsApiKey,
  };
  // const response = await api.createInvoice({
  //   ...invoice,
  // });
  const response = await axios.post(sandboxApiUrl, invoice, {
    headers: {
      'x-api-key': nowPaymentsApiKey,
      'Content-Type': 'application/json',
    },
  });

  console.log('res', response);

  return { ...newCurrencyRequest, url: response.data.invoice_url };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCurrencyRequestIpn = async (data: any): Promise<void> => {
  console.log('nowpayments-ipn data', data);
  // const result = await prisma.currencyRequest.findUnique({
  //   where: {
  //     id,
  //   },
  // });
  // return result;
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
  createCurrencyRequestInvoice,
  createCurrencyRequestIpn,
};
