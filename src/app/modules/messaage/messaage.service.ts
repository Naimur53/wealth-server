import { Messaage, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { messaageSearchableFields } from './messaage.constant';
        import { IMessaageFilters } from './messaage.interface';
        
        const getAllMessaage = async (
          filters: IMessaageFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Messaage[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = messaageSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.MessaageWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.messaage.findMany({
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
          const total = await prisma.messaage.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createMessaage = async (
          payload: Messaage
        ): Promise<Messaage | null> => {
          const newMessaage = await prisma.messaage.create({
            data: payload,
          });
          return newMessaage;
        };
        
        const getSingleMessaage = async (
          id: string
        ): Promise<Messaage | null> => {
          const result = await prisma.messaage.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateMessaage = async (
          id: string,
          payload: Partial<Messaage>
        ): Promise<Messaage | null> => {
          const result = await prisma.messaage.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteMessaage = async (
          id: string
        ): Promise<Messaage | null> => {
          const result = await prisma.messaage.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Messaage not found!');
          }
          return result;
        };
        
        export const MessaageService = {
          getAllMessaage,
          createMessaage,
          updateMessaage,
          getSingleMessaage,
          deleteMessaage,
        };