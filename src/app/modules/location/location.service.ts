import { Location, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { locationSearchableFields } from './location.constant';
import { ILocationFilters } from './location.interface';

const getAllLocation = async (
  filters: ILocationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Location[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination({
    ...paginationOptions,
    limit: paginationOptions.limit || 100,
  });

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = locationSearchableFields.map(single => {
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

  const whereConditions: Prisma.LocationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.location.findMany({
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
      _count: true,
    },
  });
  const total = await prisma.location.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createLocation = async (payload: Location): Promise<Location | null> => {
  const isExits = await prisma.location.findUnique({
    where: { name: payload.name },
  });
  if (isExits) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Location already exits');
  }
  const newLocation = await prisma.location.create({
    data: payload,
  });
  return newLocation;
};

const getSingleLocation = async (
  id: string,
  extraInfo: { flipping: boolean; crowdFund: boolean; property: boolean }
): Promise<Location | null> => {
  const result = await prisma.location.findUnique({
    where: {
      id,
    },
    include: {
      ...extraInfo,
    },
  });
  return result;
};

const updateLocation = async (
  id: string,
  payload: Partial<Location>
): Promise<Location | null> => {
  const result = await prisma.location.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteLocation = async (id: string): Promise<Location | null> => {
  const result = await prisma.$transaction(async tx => {
    await tx.property.deleteMany({ where: { locationId: id } });
    await tx.crowdFund.deleteMany({ where: { locationId: id } });
    return await tx.location.delete({
      where: { id },
    });
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found!');
  }
  return result;
};

export const LocationService = {
  getAllLocation,
  createLocation,
  updateLocation,
  getSingleLocation,
  deleteLocation,
};
