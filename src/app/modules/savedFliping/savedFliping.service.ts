import { SavedFliping, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { savedFlipingSearchableFields } from './savedFliping.constant';
        import { ISavedFlipingFilters } from './savedFliping.interface';
        
        const getAllSavedFliping = async (
          filters: ISavedFlipingFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<SavedFliping[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = savedFlipingSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.SavedFlipingWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.savedFliping.findMany({
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
          const total = await prisma.savedFliping.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createSavedFliping = async (
          payload: SavedFliping
        ): Promise<SavedFliping | null> => {
          const newSavedFliping = await prisma.savedFliping.create({
            data: payload,
          });
          return newSavedFliping;
        };
        
        const getSingleSavedFliping = async (
          id: string
        ): Promise<SavedFliping | null> => {
          const result = await prisma.savedFliping.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSavedFliping = async (
          id: string,
          payload: Partial<SavedFliping>
        ): Promise<SavedFliping | null> => {
          const result = await prisma.savedFliping.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSavedFliping = async (
          id: string
        ): Promise<SavedFliping | null> => {
          const result = await prisma.savedFliping.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SavedFliping not found!');
          }
          return result;
        };
        
        export const SavedFlipingService = {
          getAllSavedFliping,
          createSavedFliping,
          updateSavedFliping,
          getSingleSavedFliping,
          deleteSavedFliping,
        };