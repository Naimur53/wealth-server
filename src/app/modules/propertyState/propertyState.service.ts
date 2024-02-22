import { PropertyState, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { propertyStateSearchableFields } from './propertyState.constant';
        import { IPropertyStateFilters } from './propertyState.interface';
        
        const getAllPropertyState = async (
          filters: IPropertyStateFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<PropertyState[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = propertyStateSearchableFields.map(single => {
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
        
          const whereConditions: Prisma.PropertyStateWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.propertyState.findMany({
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
          const total = await prisma.propertyState.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createPropertyState = async (
          payload: PropertyState
        ): Promise<PropertyState | null> => {
          const newPropertyState = await prisma.propertyState.create({
            data: payload,
          });
          return newPropertyState;
        };
        
        const getSinglePropertyState = async (
          id: string
        ): Promise<PropertyState | null> => {
          const result = await prisma.propertyState.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updatePropertyState = async (
          id: string,
          payload: Partial<PropertyState>
        ): Promise<PropertyState | null> => {
          const result = await prisma.propertyState.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deletePropertyState = async (
          id: string
        ): Promise<PropertyState | null> => {
          const result = await prisma.propertyState.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'PropertyState not found!');
          }
          return result;
        };
        
        export const PropertyStateService = {
          getAllPropertyState,
          createPropertyState,
          updatePropertyState,
          getSinglePropertyState,
          deletePropertyState,
        };