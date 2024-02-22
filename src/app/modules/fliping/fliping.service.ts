import { Fliping, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { flipingSearchableFields } from './fliping.constant';
        import { IFlipingFilters } from './fliping.interface';
        
        const getAllFliping = async (
          filters: IFlipingFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Fliping[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = flipingSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.FlipingWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.fliping.findMany({
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
          const total = await prisma.fliping.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createFliping = async (
          payload: Fliping
        ): Promise<Fliping | null> => {
          const newFliping = await prisma.fliping.create({
            data: payload,
          });
          return newFliping;
        };
        
        const getSingleFliping = async (
          id: string
        ): Promise<Fliping | null> => {
          const result = await prisma.fliping.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateFliping = async (
          id: string,
          payload: Partial<Fliping>
        ): Promise<Fliping | null> => {
          const result = await prisma.fliping.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteFliping = async (
          id: string
        ): Promise<Fliping | null> => {
          const result = await prisma.fliping.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Fliping not found!');
          }
          return result;
        };
        
        export const FlipingService = {
          getAllFliping,
          createFliping,
          updateFliping,
          getSingleFliping,
          deleteFliping,
        };