import { SavedCrowdFund, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { savedCrowdFundSearchableFields } from './savedCrowdFund.constant';
        import { ISavedCrowdFundFilters } from './savedCrowdFund.interface';
        
        const getAllSavedCrowdFund = async (
          filters: ISavedCrowdFundFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<SavedCrowdFund[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = savedCrowdFundSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.SavedCrowdFundWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.savedCrowdFund.findMany({
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
          const total = await prisma.savedCrowdFund.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createSavedCrowdFund = async (
          payload: SavedCrowdFund
        ): Promise<SavedCrowdFund | null> => {
          const newSavedCrowdFund = await prisma.savedCrowdFund.create({
            data: payload,
          });
          return newSavedCrowdFund;
        };
        
        const getSingleSavedCrowdFund = async (
          id: string
        ): Promise<SavedCrowdFund | null> => {
          const result = await prisma.savedCrowdFund.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSavedCrowdFund = async (
          id: string,
          payload: Partial<SavedCrowdFund>
        ): Promise<SavedCrowdFund | null> => {
          const result = await prisma.savedCrowdFund.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSavedCrowdFund = async (
          id: string
        ): Promise<SavedCrowdFund | null> => {
          const result = await prisma.savedCrowdFund.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SavedCrowdFund not found!');
          }
          return result;
        };
        
        export const SavedCrowdFundService = {
          getAllSavedCrowdFund,
          createSavedCrowdFund,
          updateSavedCrowdFund,
          getSingleSavedCrowdFund,
          deleteSavedCrowdFund,
        };