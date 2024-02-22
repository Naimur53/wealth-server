import { FlipingOrders, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { flipingOrdersSearchableFields } from './flipingOrders.constant';
        import { IFlipingOrdersFilters } from './flipingOrders.interface';
        
        const getAllFlipingOrders = async (
          filters: IFlipingOrdersFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<FlipingOrders[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = flipingOrdersSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.FlipingOrdersWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.flipingOrders.findMany({
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
          const total = await prisma.flipingOrders.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createFlipingOrders = async (
          payload: FlipingOrders
        ): Promise<FlipingOrders | null> => {
          const newFlipingOrders = await prisma.flipingOrders.create({
            data: payload,
          });
          return newFlipingOrders;
        };
        
        const getSingleFlipingOrders = async (
          id: string
        ): Promise<FlipingOrders | null> => {
          const result = await prisma.flipingOrders.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateFlipingOrders = async (
          id: string,
          payload: Partial<FlipingOrders>
        ): Promise<FlipingOrders | null> => {
          const result = await prisma.flipingOrders.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteFlipingOrders = async (
          id: string
        ): Promise<FlipingOrders | null> => {
          const result = await prisma.flipingOrders.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'FlipingOrders not found!');
          }
          return result;
        };
        
        export const FlipingOrdersService = {
          getAllFlipingOrders,
          createFlipingOrders,
          updateFlipingOrders,
          getSingleFlipingOrders,
          deleteFlipingOrders,
        };