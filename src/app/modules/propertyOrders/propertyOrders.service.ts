import { PropertyOrders, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { propertyOrdersSearchableFields } from './propertyOrders.constant';
        import { IPropertyOrdersFilters } from './propertyOrders.interface';
        
        const getAllPropertyOrders = async (
          filters: IPropertyOrdersFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<PropertyOrders[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = propertyOrdersSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.PropertyOrdersWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.propertyOrders.findMany({
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
          const total = await prisma.propertyOrders.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createPropertyOrders = async (
          payload: PropertyOrders
        ): Promise<PropertyOrders | null> => {
          const newPropertyOrders = await prisma.propertyOrders.create({
            data: payload,
          });
          return newPropertyOrders;
        };
        
        const getSinglePropertyOrders = async (
          id: string
        ): Promise<PropertyOrders | null> => {
          const result = await prisma.propertyOrders.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updatePropertyOrders = async (
          id: string,
          payload: Partial<PropertyOrders>
        ): Promise<PropertyOrders | null> => {
          const result = await prisma.propertyOrders.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deletePropertyOrders = async (
          id: string
        ): Promise<PropertyOrders | null> => {
          const result = await prisma.propertyOrders.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'PropertyOrders not found!');
          }
          return result;
        };
        
        export const PropertyOrdersService = {
          getAllPropertyOrders,
          createPropertyOrders,
          updatePropertyOrders,
          getSinglePropertyOrders,
          deletePropertyOrders,
        };