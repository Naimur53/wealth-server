import { ChatGroup, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { chatGroupSearchableFields } from './chatGroup.constant';
import { IChatGroupFilters } from './chatGroup.interface';

const getAllChatGroup = async (
  filters: IChatGroupFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ChatGroup[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = chatGroupSearchableFields.map(single => {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ChatGroupWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.chatGroup.findMany({
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
  const total = await prisma.chatGroup.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createChatGroup = async (
  payload: ChatGroup
): Promise<ChatGroup | null> => {
  const newChatGroup = await prisma.chatGroup.create({
    data: payload,
  });
  return newChatGroup;
};

const getSingleChatGroup = async (id: string): Promise<ChatGroup | null> => {
  const result = await prisma.chatGroup.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateChatGroup = async (
  id: string,
  payload: Partial<ChatGroup>
): Promise<ChatGroup | null> => {
  const result = await prisma.chatGroup.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteChatGroup = async (id: string): Promise<ChatGroup | null> => {
  const result = await prisma.chatGroup.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ChatGroup not found!');
  }
  return result;
};

export const ChatGroupService = {
  getAllChatGroup,
  createChatGroup,
  updateChatGroup,
  getSingleChatGroup,
  deleteChatGroup,
};
