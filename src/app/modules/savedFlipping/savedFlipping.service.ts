import { SavedFlipping } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllSavedFlipping = async (
  userId: string
): Promise<SavedFlipping[]> => {
  const output = await prisma.savedFlipping.findMany({
    where: { ownById: userId },
    include: {
      flipping: true,
    },
  });
  return output;
};

const createSavedFlipping = async (
  payload: SavedFlipping
): Promise<SavedFlipping | null> => {
  const isFlippingExits = await prisma.flipping.findUnique({
    where: { id: payload.flippingId },
  });
  if (!isFlippingExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'flipping is not exits');
  }
  // check already saved ?
  const isAlreadyExist = await prisma.savedFlipping.findFirst({
    where: {
      ownById: payload.ownById,
      flippingId: payload.flippingId,
    },
  });
  if (isAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already saved');
  }
  const newSavedFlipping = await prisma.savedFlipping.create({
    data: payload,
  });
  return newSavedFlipping;
};

const getSingleSavedFlipping = async (
  id: string
): Promise<SavedFlipping | null> => {
  const result = await prisma.savedFlipping.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSavedFlipping = async (
  id: string,
  payload: Partial<SavedFlipping>
): Promise<SavedFlipping | null> => {
  const result = await prisma.savedFlipping.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSavedFlipping = async (
  id: string
): Promise<SavedFlipping | null> => {
  const result = await prisma.savedFlipping.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SavedFlipping not found!');
  }
  return result;
};

export const SavedFlippingService = {
  getAllSavedFlipping,
  createSavedFlipping,
  updateSavedFlipping,
  getSingleSavedFlipping,
  deleteSavedFlipping,
};
