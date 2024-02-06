import { Prisma, User, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import UpdateSellerAfterPay from '../../../helpers/UpdateSellerAfterPay';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import nowPaymentChecker from '../../../helpers/nowPaymentChecker';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import {
  IGenericResponse,
  TAdminOverview,
  TSellerOverview,
  TUserOverview,
} from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import { IUserFilters } from './user.interface';

const getAllUser = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Omit<User, 'password'>[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = userSearchableFields.map(single => {
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
          equals:
            key === 'isApprovedForSeller'
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                JSON.parse((filterData as any)[key])
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  console.log({ page, limit, skip }, whereConditions);
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,

    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            id: 'desc',
          },
    select: {
      email: true,
      id: true,
      name: true,
      profileImg: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      isBlocked: true,
      isApprovedForSeller: true,
      txId: true,
      shouldSendEmail: true,
      phoneNumber: true,
      isPaidForSeller: true,
      Currency: {
        select: {
          amount: true,
        },
      },
    },
  });
  const total = await prisma.user.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createUser = async (payload: Omit<User, 'id'>): Promise<User | null> => {
  const newUser = await prisma.user.create({
    data: payload,
  });
  return newUser;
};

const getSingleUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sellerIpn = async (data: any): Promise<void> => {
  console.log('nowpayments-ipn data', data);
  if (data.payment_status !== 'finished') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Sorry payment is not finished yet '
    );
  }
  await nowPaymentChecker(data.payment_id);
  const { order_id, payment_status, price_amount } = data;
  await UpdateSellerAfterPay({
    order_id,
    payment_status,
    price_amount,
  });
  // update user to vari
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
  requestedUser: JwtPayload
): Promise<User | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, isPaidForSeller, isApprovedForSeller, ...rest } = payload;
  let genarateBycryptPass;
  if (password) {
    genarateBycryptPass = await createBycryptPassword(password);
  }

  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  console.log(rest, isUserExist);
  const isRoleExits = rest.role;
  const isRoleNotMatch = isUserExist.role !== rest.role;
  const isRequestedUSerNotSuperAdmin =
    requestedUser.role !== UserRole.superAdmin;

  if (isRoleExits && isRoleNotMatch && isRequestedUSerNotSuperAdmin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User role can only be changed by super admin'
    );
  }

  if (requestedUser.role !== UserRole.admin && payload.isApprovedForSeller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'only admin can verify seller ');
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: genarateBycryptPass
      ? { ...rest, password: genarateBycryptPass }
      : rest,
  });

  // if admin update a seller verification send email
  if (payload.isApprovedForSeller && result.role === UserRole.seller) {
    sendEmail(
      { to: result.email },
      {
        subject: EmailTemplates.sellerRequestAccepted.subject,
        html: EmailTemplates.sellerRequestAccepted.html(),
      }
    );
  }
  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.$transaction(async tx => {
    console.log(id);
    // Inside the transaction, perform your database operations

    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteAccount = await tx.account.deleteMany({
      where: { ownById: id },
    });
    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteOrder = await tx.orders.deleteMany({
      where: { orderById: id },
    });
    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteCarts = await tx.cart.deleteMany({
      where: { ownById: id },
    });
    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteCurrency = await tx.currency.deleteMany({
      where: { ownById: id },
    });
    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteCurrencyRequest = await tx.currencyRequest.deleteMany({
      where: { ownById: id },
    });
    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteWithdrawalRequest = await tx.withdrawalRequest.deleteMany({
      where: { ownById: id },
    });
    const deleteUser = await tx.user.delete({ where: { id } });
    return deleteUser;
  });
};

const adminOverview = async (): Promise<TAdminOverview | null> => {
  const totalAccount = await prisma.account.count();
  const totalSoldAccount = await prisma.account.count({
    where: { isSold: true },
  });
  const totalUser = await prisma.account.count();
  const mainAdmin = await prisma.user.findUnique({
    where: { email: config.mainAdminEmail },
    include: {
      Currency: { select: { amount: true } },
    },
  });
  if (!mainAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Main admin Not found!');
  }
  const totalEarning = mainAdmin.Currency?.amount || 0;
  return {
    totalAccount,
    totalSoldAccount,
    totalUser,
    totalEarning,
  };
};
const sellerOverview = async (id: string): Promise<TSellerOverview | null> => {
  const totalAccount = await prisma.account.count({ where: { ownById: id } });
  const totalSoldAccount = await prisma.account.count({
    where: { isSold: true, ownById: id },
  });
  const totalOrder = await prisma.orders.count({ where: { orderById: id } });
  const currency = await prisma.currency.findUnique({
    where: { ownById: id },
  });
  const totalMoney = currency?.amount || 0;
  return {
    totalAccount,
    totalSoldAccount,
    totalOrder,
    totalMoney,
  };
};
const userOverview = async (id: string): Promise<TUserOverview | null> => {
  const totalOrder = await prisma.orders.count({ where: { orderById: id } });
  const totalAccountOnCart = await prisma.cart.count({
    where: { ownById: id },
  });
  // const totalOrder = await prisma.account.count({ where: { ownById: id } });
  const currency = await prisma.currency.findUnique({
    where: { ownById: id },
  });
  const totalMoney = currency?.amount || 0;
  return {
    totalOrder,
    totalAccountOnCart,
    totalMoney,
  };
};

export const UserService = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
  sellerIpn,
  adminOverview,
  sellerOverview,
  userOverview,
};
