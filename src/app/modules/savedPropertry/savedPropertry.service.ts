import { SavedPropertry, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { savedPropertrySearchableFields } from './savedPropertry.constant';
        import { ISavedPropertryFilters } from './savedPropertry.interface';
        
        const getAllSavedPropertry = async (
          filters: ISavedPropertryFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<SavedPropertry[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = savedPropertrySearchableFields.map(single => {
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
        
          const whereConditions: Prisma.SavedPropertryWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.savedPropertry.findMany({
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
          const total = await prisma.savedPropertry.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createSavedPropertry = async (
          payload: SavedPropertry
        ): Promise<SavedPropertry | null> => {
          const newSavedPropertry = await prisma.savedPropertry.create({
            data: payload,
          });
          return newSavedPropertry;
        };
        
        const getSingleSavedPropertry = async (
          id: string
        ): Promise<SavedPropertry | null> => {
          const result = await prisma.savedPropertry.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSavedPropertry = async (
          id: string,
          payload: Partial<SavedPropertry>
        ): Promise<SavedPropertry | null> => {
          const result = await prisma.savedPropertry.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSavedPropertry = async (
          id: string
        ): Promise<SavedPropertry | null> => {
          const result = await prisma.savedPropertry.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SavedPropertry not found!');
          }
          return result;
        };
        
        export const SavedPropertryService = {
          getAllSavedPropertry,
          createSavedPropertry,
          updateSavedPropertry,
          getSingleSavedPropertry,
          deleteSavedPropertry,
        };