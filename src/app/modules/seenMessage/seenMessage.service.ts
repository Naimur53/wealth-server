import { SeenMessage, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { seenMessageSearchableFields } from './seenMessage.constant';
        import { ISeenMessageFilters } from './seenMessage.interface';
        
        const getAllSeenMessage = async (
          filters: ISeenMessageFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<SeenMessage[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = seenMessageSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.SeenMessageWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.seenMessage.findMany({
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
          const total = await prisma.seenMessage.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createSeenMessage = async (
          payload: SeenMessage
        ): Promise<SeenMessage | null> => {
          const newSeenMessage = await prisma.seenMessage.create({
            data: payload,
          });
          return newSeenMessage;
        };
        
        const getSingleSeenMessage = async (
          id: string
        ): Promise<SeenMessage | null> => {
          const result = await prisma.seenMessage.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateSeenMessage = async (
          id: string,
          payload: Partial<SeenMessage>
        ): Promise<SeenMessage | null> => {
          const result = await prisma.seenMessage.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteSeenMessage = async (
          id: string
        ): Promise<SeenMessage | null> => {
          const result = await prisma.seenMessage.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'SeenMessage not found!');
          }
          return result;
        };
        
        export const SeenMessageService = {
          getAllSeenMessage,
          createSeenMessage,
          updateSeenMessage,
          getSingleSeenMessage,
          deleteSeenMessage,
        };