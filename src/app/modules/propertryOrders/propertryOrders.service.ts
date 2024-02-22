import { PropertryOrders, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { propertryOrdersSearchableFields } from './propertryOrders.constant';
        import { IPropertryOrdersFilters } from './propertryOrders.interface';
        
        const getAllPropertryOrders = async (
          filters: IPropertryOrdersFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<PropertryOrders[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = propertryOrdersSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.PropertryOrdersWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.propertryOrders.findMany({
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
          const total = await prisma.propertryOrders.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createPropertryOrders = async (
          payload: PropertryOrders
        ): Promise<PropertryOrders | null> => {
          const newPropertryOrders = await prisma.propertryOrders.create({
            data: payload,
          });
          return newPropertryOrders;
        };
        
        const getSinglePropertryOrders = async (
          id: string
        ): Promise<PropertryOrders | null> => {
          const result = await prisma.propertryOrders.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updatePropertryOrders = async (
          id: string,
          payload: Partial<PropertryOrders>
        ): Promise<PropertryOrders | null> => {
          const result = await prisma.propertryOrders.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deletePropertryOrders = async (
          id: string
        ): Promise<PropertryOrders | null> => {
          const result = await prisma.propertryOrders.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'PropertryOrders not found!');
          }
          return result;
        };
        
        export const PropertryOrdersService = {
          getAllPropertryOrders,
          createPropertryOrders,
          updatePropertryOrders,
          getSinglePropertryOrders,
          deletePropertryOrders,
        };