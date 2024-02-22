import { Property, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { propertySearchableFields } from './property.constant';
        import { IPropertyFilters } from './property.interface';
        
        const getAllProperty = async (
          filters: IPropertyFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Property[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = propertySearchableFields.map(single => {
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
        
          const whereConditions: Prisma.PropertyWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.property.findMany({
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
          const total = await prisma.property.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createProperty = async (
          payload: Property
        ): Promise<Property | null> => {
          const newProperty = await prisma.property.create({
            data: payload,
          });
          return newProperty;
        };
        
        const getSingleProperty = async (
          id: string
        ): Promise<Property | null> => {
          const result = await prisma.property.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateProperty = async (
          id: string,
          payload: Partial<Property>
        ): Promise<Property | null> => {
          const result = await prisma.property.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteProperty = async (
          id: string
        ): Promise<Property | null> => {
          const result = await prisma.property.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Property not found!');
          }
          return result;
        };
        
        export const PropertyService = {
          getAllProperty,
          createProperty,
          updateProperty,
          getSingleProperty,
          deleteProperty,
        };