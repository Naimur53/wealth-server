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
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
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
          });
          const total = await prisma.location.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createLocation = async (
          payload: Location
        ): Promise<Location | null> => {
          const newLocation = await prisma.location.create({
            data: payload,
          });
          return newLocation;
        };
        
        const getSingleLocation = async (
          id: string
        ): Promise<Location | null> => {
          const result = await prisma.location.findUnique({
            where: {
              id,
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
        
        const deleteLocation = async (
          id: string
        ): Promise<Location | null> => {
          const result = await prisma.location.delete({
            where: { id },
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