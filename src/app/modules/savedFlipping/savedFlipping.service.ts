import { SavedFlipping, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { savedFlippingSearchableFields } from './savedFlipping.constant';
        import { ISavedFlippingFilters } from './savedFlipping.interface';
        
        const getAllSavedFlipping = async (
          filters: ISavedFlippingFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<SavedFlipping[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = savedFlippingSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.SavedFlippingWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.savedFlipping.findMany({
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
          const total = await prisma.savedFlipping.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createSavedFlipping = async (
          payload: SavedFlipping
        ): Promise<SavedFlipping | null> => {
          const newSavedFlipping = await prisma.savedFlipping.create({
            data: payload,
          });
          return newSavedFlipping;
        };
        
        const getSingleSavedFlipping = async (
          id: string
        ): Promise<SavedFlipping | null> => {
          const result = await prisma.savedFlipping.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSavedFlipping = async (
          id: string,
          payload: Partial<SavedFlipping>
        ): Promise<SavedFlipping | null> => {
          const result = await prisma.savedFlipping.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSavedFlipping = async (
          id: string
        ): Promise<SavedFlipping | null> => {
          const result = await prisma.savedFlipping.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SavedFlipping not found!');
          }
          return result;
        };
        
        export const SavedFlippingService = {
          getAllSavedFlipping,
          createSavedFlipping,
          updateSavedFlipping,
          getSingleSavedFlipping,
          deleteSavedFlipping,
        };