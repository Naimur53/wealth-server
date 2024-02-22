import { Feedback, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { feedbackSearchableFields } from './feedback.constant';
        import { IFeedbackFilters } from './feedback.interface';
        
        const getAllFeedback = async (
          filters: IFeedbackFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Feedback[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = feedbackSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.FeedbackWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.feedback.findMany({
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
          const total = await prisma.feedback.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createFeedback = async (
          payload: Feedback
        ): Promise<Feedback | null> => {
          const newFeedback = await prisma.feedback.create({
            data: payload,
          });
          return newFeedback;
        };
        
        const getSingleFeedback = async (
          id: string
        ): Promise<Feedback | null> => {
          const result = await prisma.feedback.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateFeedback = async (
          id: string,
          payload: Partial<Feedback>
        ): Promise<Feedback | null> => {
          const result = await prisma.feedback.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteFeedback = async (
          id: string
        ): Promise<Feedback | null> => {
          const result = await prisma.feedback.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found!');
          }
          return result;
        };
        
        export const FeedbackService = {
          getAllFeedback,
          createFeedback,
          updateFeedback,
          getSingleFeedback,
          deleteFeedback,
        };