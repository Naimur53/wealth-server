import { CrowdFundOrders, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { crowdFundOrdersSearchableFields } from './crowdFundOrders.constant';
        import { ICrowdFundOrdersFilters } from './crowdFundOrders.interface';
        
        const getAllCrowdFundOrders = async (
          filters: ICrowdFundOrdersFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<CrowdFundOrders[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = crowdFundOrdersSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.CrowdFundOrdersWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.crowdFundOrders.findMany({
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
          const total = await prisma.crowdFundOrders.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createCrowdFundOrders = async (
          payload: CrowdFundOrders
        ): Promise<CrowdFundOrders | null> => {
          const newCrowdFundOrders = await prisma.crowdFundOrders.create({
            data: payload,
          });
          return newCrowdFundOrders;
        };
        
        const getSingleCrowdFundOrders = async (
          id: string
        ): Promise<CrowdFundOrders | null> => {
          const result = await prisma.crowdFundOrders.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateCrowdFundOrders = async (
          id: string,
          payload: Partial<CrowdFundOrders>
        ): Promise<CrowdFundOrders | null> => {
          const result = await prisma.crowdFundOrders.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteCrowdFundOrders = async (
          id: string
        ): Promise<CrowdFundOrders | null> => {
          const result = await prisma.crowdFundOrders.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'CrowdFundOrders not found!');
          }
          return result;
        };
        
        export const CrowdFundOrdersService = {
          getAllCrowdFundOrders,
          createCrowdFundOrders,
          updateCrowdFundOrders,
          getSingleCrowdFundOrders,
          deleteCrowdFundOrders,
        };