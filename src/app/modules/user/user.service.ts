import { Prisma, User, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { initiatePayment } from '../../../helpers/paystackPayment';
import {
  EPaymentType,
  IGenericResponse,
  TAdminOverview,
} from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import generateId from '../../../utils/generateId';
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
            key === 'isChampion'
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
      status: true,
      phoneNumber: true,
      dateOfBirth: true,
      gender: true,
      location: true,
      isChampion: true,
      deviceNotificationToken: true,
      isPaid: true,
      txId: true,
      shouldSendNotification: true,
    },
  });
  const total = await prisma.user.count({ where: whereConditions });
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

const updateUser = async (
  id: string,
  payload: Partial<User>,
  requestedUser: JwtPayload
): Promise<User | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, status, ...rest } = payload;
  let genarateBycryptPass;
  if (password) {
    genarateBycryptPass = await createBycryptPassword(password);
  }

  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
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
  const isChangeChampion = Boolean(payload.isChampion !== undefined);
  if (isChangeChampion && isRequestedUSerNotSuperAdmin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Champion can only set by admin'
    );
  }
  const isBlockChampion = Boolean(payload.isChampion !== undefined);
  if (isBlockChampion && isRequestedUSerNotSuperAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Block can only set by admin');
  }
  // if (requestedUser.role === UserRole.user && payload.status) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     'only admin and super admin can verify seller '
  //   );
  // }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: genarateBycryptPass
      ? { ...rest, password: genarateBycryptPass }
      : rest,
  });

  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.$transaction(async tx => {
    // Inside the transaction, perform your database operations

    // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
    const deleteAccount = await tx.verificationOtp.deleteMany({
      where: { ownById: id },
    });

    const deleteUser = await tx.user.delete({ where: { id } });
    return deleteUser;
  });
};
const generateUserPay = async (id: string): Promise<User | null> => {
  const isUserExist = await prisma.user.findUnique({ where: { id } });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }
  if (isUserExist.isPaid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'already paid');
  }
  // add tx id
  const request = await initiatePayment(
    config.sellerOneTimePayment,
    isUserExist.email,
    generateId(),
    EPaymentType.user,
    isUserExist.id,
    config.frontendUrl
  );
  const output = await prisma.user.update({
    where: { id },
    data: { txId: request.data.authorization_url },
  });
  return output;
};

const adminOverview = async (): Promise<TAdminOverview | null> => {
  const totalOrder = await prisma.orders.count();
  const totalOrderComplete = await prisma.orders.count({
    where: { status: 'success' },
  });
  const totalUser = await prisma.user.count({
    where: { role: 'user', isChampion: false },
  });
  const totalAdmin = await prisma.user.count({
    where: { role: 'admin', isChampion: false },
  });
  const totalChampion = await prisma.user.count({
    where: { role: 'admin', isChampion: false },
  });
  const totalCrowdFund = await prisma.crowdFund.count();
  const totalFlipping = await prisma.flipping.count();
  const totalProperty = await prisma.property.count();
  return {
    totalAdmin,
    totalChampion,
    totalUser,
    totalCrowdFund,
    totalFlipping,
    totalProperty,
    totalOrder,
    totalOrderComplete,
  };
};
// const sellerOverview = async (id: string): Promise<TSellerOverview | null> => {
//   const totalAccount = await prisma.account.count({ where: { ownById: id } });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalAccount,
//     totalSoldAccount,
//     totalOrder,
//     totalMoney,
//   };
// };
// const userOverview = async (id: string): Promise<TUserOverview | null> => {
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalAccountOnCart = await prisma.cart.count({
//     where: { ownById: id },
//   });
//   // const totalOrder = await prisma.account.count({ where: { ownById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalOrder,
//     totalAccountOnCart,
//     totalMoney,
//   };
// };
const sendUserQuery = async (
  id: string,
  description: string,
  queryType: string
): Promise<void> => {
  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found!');
  }
  const transport = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailUserPass,
    },
  });
  // const transport = await nodemailer.createTransport({
  //   host: 'mail.privateemail.com', // or 'smtp.privateemail.com'
  //   port: 587, // or 465 for SSL
  //   secure: false, // true for 465, false for 587
  //   auth: {
  //     user: config.emailUser,
  //     pass: config.emailUserPass,
  //   },
  //   tls: {
  //     // Enable TLS encryption
  //     ciphers: 'SSLv3',
  //   },
  // });
  // send mail with defined transport object
  const mailOptions = {
    from: config.emailUser,
    to: config.emailUser,
    subject: `${isUserExist.name} asked a Query about ${queryType}`,
    text: `
    This query asked from ${isUserExist.email}

    The query:${description}
    `,
  };
  try {
    await transport.sendMail({ ...mailOptions });
  } catch (err) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Sorry try again after some time'
    );
  }
};

export const UserService = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
  sendUserQuery,
  generateUserPay,
  adminOverview,
  // sellerOverview,
  // userOverview,
};
