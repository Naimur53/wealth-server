import { Promotion, PromotionInterest } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllPromotion = async (): Promise<any[]> => {
  const result = await prisma.promotion.findMany({
    select: {
      date: true,
      title: true,
      streetLocation: true,
      thumbnail: true,
      location: true,
      interesteds: {
        select: {
          ownBy: {
            select: {
              profileImg: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const createPromotion = async (
  payload: Promotion
): Promise<Promotion | null> => {
  const newPromotion = await prisma.promotion.create({
    data: payload,
  });
  return newPromotion;
};

const getSinglePromotion = async (id: string): Promise<Promotion | null> => {
  const result = await prisma.promotion.findUnique({
    where: {
      id,
    },
    include: {
      interesteds: {
        select: {
          ownBy: {
            select: {
              profileImg: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updatePromotion = async (
  id: string,
  payload: Partial<Promotion>
): Promise<Promotion | null> => {
  const result = await prisma.promotion.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deletePromotion = async (id: string): Promise<Promotion | null> => {
  const result = await prisma.promotion.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Promotion not found!');
  }
  return result;
};

const addInterestInPromotion = async (payload: {
  userId: string;
  promotionId: string;
}): Promise<PromotionInterest | null> => {
  const isAlreadyExist = await prisma.promotionInterest.findFirst({
    where: {
      ownById: payload.userId,
      promotionId: payload.promotionId,
    },
  });
  if (isAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already interested!');
  }
  const newInterest = await prisma.promotionInterest.create({
    data: {
      promotionId: payload.promotionId,
      ownById: payload.userId,
    },
  });
  return newInterest;
};
const removeInterestInPromotion = async (payload: {
  userId: string;
  promotionId: string;
}): Promise<PromotionInterest | null> => {
  const isAlreadyExist = await prisma.promotionInterest.findFirst({
    where: {
      ownById: payload.userId,
      promotionId: payload.promotionId,
    },
  });
  if (!isAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'not found!');
  }
  const newInterest = await prisma.promotionInterest.delete({
    where: {
      id: isAlreadyExist.id,
    },
  });
  return newInterest;
};

export const PromotionService = {
  getAllPromotion,
  createPromotion,
  updatePromotion,
  getSinglePromotion,
  deletePromotion,
  addInterestInPromotion,
  removeInterestInPromotion,
};
