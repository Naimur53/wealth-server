import { EChatGroupType, Message, Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import currentTime from '../../../utils/currentTime';
import { messageSearchableFields } from './message.constant';
import { IMessageFilters } from './message.interface';

const getAllMessage = async (
  filters: IMessageFilters,
  paginationOptions: IPaginationOptions,
  groupId: string,
  userId: string
): Promise<IGenericResponse<Message[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;
  // const chatGroupId= filterData.chatGroupId;
  const andCondition = [];
  if (searchTerm) {
    const searchAbleFields = messageSearchableFields.map(single => {
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

  const whereConditions: Prisma.MessageWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  let result = await prisma.message.findMany({
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
    include: {
      reply: {
        include: {
          sendBy: {
            select: {
              email: true,
              id: true,
              profileImg: true,
            },
          },
        },
      },
      sendBy: {
        select: {
          email: true,
          id: true,
          profileImg: true,
        },
      },
    },
  });
  const total = await prisma.message.count();
  const isSeenMessageExits = await prisma.seenMessage.findUnique({
    where: { seenById: userId, groupId: groupId },
  });
  let unSeenCount: number = 0;
  if (isSeenMessageExits) {
    result = result.map(single => {
      const isSeen =
        new Date(isSeenMessageExits.lastSeen) >= new Date(single.createdAt);
      if (!isSeen) {
        unSeenCount++;
      }
      return {
        ...single,
        isSeen,
      };
    });
  }
  const output = {
    data: result,
    meta: { page, limit, total, unSeenCount },
  };
  return output;
};

const createMessage = async (payload: Message): Promise<Message | null> => {
  const isGroupExits = await prisma.chatGroup.findUnique({
    where: { id: payload.chatGroupId },
  });
  if (!isGroupExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Group not found');
  }
  const isUserExist = await prisma.user.findUnique({
    where: { id: payload.sendById },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  //
  const isAdminGroup = isGroupExits.type === EChatGroupType.admin;
  const isChampionGroup = isGroupExits.type === EChatGroupType.champion;
  if (isAdminGroup && isUserExist.role === UserRole.user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User cannot send message to admin group'
    );
  }
  if (isChampionGroup && !isUserExist.isChampion) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Normal user cant not send message to champion group'
    );
  }

  const newMessage = await prisma.$transaction(async tx => {
    await tx.seenMessage.upsert({
      where: {
        groupId: payload.chatGroupId,
        seenById: payload.sendById,
      },
      update: {
        groupId: payload.chatGroupId,
        seenById: payload.sendById,
        lastSeen: currentTime(),
      },
      create: {
        groupId: payload.chatGroupId,
        seenById: payload.sendById,
        lastSeen: currentTime(),
      },
    });
    return await tx.message.create({
      data: payload,
    });
  });
  return newMessage;
};

const getSingleMessage = async (id: string): Promise<Message | null> => {
  const result = await prisma.message.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateMessage = async (
  id: string,
  payload: Partial<Message>
): Promise<Message | null> => {
  const result = await prisma.message.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteMessage = async (id: string): Promise<Message | null> => {
  const result = await prisma.message.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found!');
  }
  return result;
};

export const MessageService = {
  getAllMessage,
  createMessage,
  updateMessage,
  getSingleMessage,
  deleteMessage,
};
