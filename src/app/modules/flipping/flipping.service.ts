import { EPropertyStatus, Flipping, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { flippingSearchableFields } from './flipping.constant';
import { IFlippingFilters } from './flipping.interface';

const getAllFlipping = async (
  filters: IFlippingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Flipping[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, maxPrice, minPrice, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = flippingSearchableFields.map(single => {
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
  const whereConditions: Prisma.FlippingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.flipping.findMany({
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
    include: {
      Orders: {
        where: {
          status: 'success',
        },
        select: {
          orderBy: {
            select: {
              email: true,
              id: true,
              profileImg: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.flipping.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createFlipping = async (payload: Flipping): Promise<Flipping | null> => {
  const newFlipping = await prisma.flipping.create({
    data: { ...payload, status: 'pending' },
    include: {
      ownBy: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
  await sendEmail(
    { to: newFlipping.ownBy.email },
    {
      subject: EmailTemplates.userListAProperty.subject,
      html: EmailTemplates.userListAProperty.html(),
    }
  );
  return newFlipping;
};

const getSingleFlipping = async (id: string): Promise<Flipping | null> => {
  const result = await prisma.flipping.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateFlipping = async (
  id: string,
  payload: Partial<Flipping>
): Promise<Flipping | null> => {
  const result = await prisma.flipping.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFlipping = async (id: string): Promise<Flipping | null> => {
  const isExits = await prisma.flipping.findUnique({ where: { id } });
  if (!isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'property not found');
  }
  if (isExits.status === EPropertyStatus.sold) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'sold crowd fund cannot be deleted'
    );
  }
  const result = await prisma.$transaction(async tx => {
    await tx.savedFlipping.deleteMany({ where: { flippingId: id } });
    await tx.savedFlipping.deleteMany({ where: { flippingId: id } });
    return await tx.flipping.delete({
      where: { id },
    });
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Flipping not found!');
  }
  return result;
};

export const FlippingService = {
  getAllFlipping,
  createFlipping,
  updateFlipping,
  getSingleFlipping,
  deleteFlipping,
};
