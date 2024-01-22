import { Prisma, User, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import { IGenericResponse } from '../../../interfaces/common';
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

const updateUser = async (
  id: string,
  payload: Partial<User>,
  requestedUser: JwtPayload
): Promise<User | null> => {
  const { password, ...rest } = payload;
  let genarateBycryptPass;
  if (password) {
    genarateBycryptPass = await createBycryptPassword(password);
  }

  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  console.log(rest, isUserExist);

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
    const deleteUser = await tx.user.delete({ where: { id } });
    return deleteUser;
  });
};

export const UserService = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
};
