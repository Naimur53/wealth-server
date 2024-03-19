import {
  CrowdFund,
  EOrderStatus,
  EPropertyStatus,
  Orders,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { crowdFundSearchableFields } from './crowdFund.constant';
import { ICrowdFundFilters } from './crowdFund.interface';

const getAllCrowdFund = async (
  filters: ICrowdFundFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<CrowdFund[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, maxPrice, minPrice, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = crowdFundSearchableFields.map(single => {
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
      targetFund: {
        lte: Number(maxPrice),
      },
    });
  }
  if (minPrice) {
    andCondition.push({
      targetFund: {
        gte: Number(minPrice),
      },
    });
  }

  const whereConditions: Prisma.CrowdFundWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.crowdFund.findMany({
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
      location: true,
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
  const total = await prisma.crowdFund.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCrowdFund = async (
  payload: CrowdFund
): Promise<CrowdFund | null> => {
  const isLocationExist = await prisma.location.findUnique({
    where: { id: payload.locationId },
  });
  if (!isLocationExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Location Id is not valid');
  }
  const newCrowdFund = await prisma.crowdFund.create({
    data: payload,
  });
  return newCrowdFund;
};
const recentlyFunded = async (): Promise<Orders[] | null> => {
  const newCrowdFund = await prisma.orders.findMany({
    where: {
      status: 'success',
      refName: 'crowdFund',
    },
    include: {
      crowdFund: true,
    },
  });
  return newCrowdFund;
};

const getSingleCrowdFund = async (id: string): Promise<CrowdFund | null> => {
  const result = await prisma.crowdFund.findUnique({
    where: {
      id,
    },
    include: {
      location: true,
      Orders: {
        where: {
          status: EOrderStatus.success,
        },
        include: {
          orderBy: {
            select: {
              profileImg: true,
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  return result;
};

const updateCrowdFund = async (
  id: string,
  payload: Partial<CrowdFund>
): Promise<CrowdFund | null> => {
  const isExits = await prisma.crowdFund.findUnique({ where: { id } });
  if (!isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Crowd fund not found');
  }
  // if (isExits.status === EPropertyStatus.sold) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     'sold crowd fund cannot be update'
  //   );
  // }
  const result = await prisma.crowdFund.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteCrowdFund = async (id: string): Promise<CrowdFund | null> => {
  const isExits = await prisma.crowdFund.findUnique({ where: { id } });
  if (!isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Crowd fund not found');
  }
  if (isExits.status === EPropertyStatus.sold) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'sold crowd fund cannot be deleted'
    );
  }
  const result = await prisma.$transaction(async tx => {
    await tx.orders.deleteMany({
      where: { crowdFundId: id },
    });
    await tx.orders.deleteMany({
      where: { crowdFundId: id },
    });
    await tx.savedCrowdFund.deleteMany({
      where: { crowdFundId: id },
    });
    return await tx.crowdFund.delete({
      where: { id },
    });
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CrowdFund not found!');
  }
  return result;
};

export const CrowdFundService = {
  getAllCrowdFund,
  createCrowdFund,
  updateCrowdFund,
  getSingleCrowdFund,
  deleteCrowdFund,
  recentlyFunded,
};
