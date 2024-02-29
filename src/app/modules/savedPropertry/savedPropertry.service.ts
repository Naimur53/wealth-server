import { SavedPropertry } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllSavedPropertry = async (
  userId: string
): Promise<SavedPropertry[]> => {
  const output = await prisma.savedPropertry.findMany({
    where: { ownById: userId },
    include: {
      property: true,
    },
  });
  return output;
};

const createSavedPropertry = async (
  payload: SavedPropertry
): Promise<SavedPropertry | null> => {
  const isPropertyExits = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });
  if (!isPropertyExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, ' property is not exits');
  }
  // check already saved ?
  const isAlreadyExist = await prisma.savedPropertry.findFirst({
    where: {
      ownById: payload.ownById,
      propertyId: payload.propertyId,
    },
  });
  if (isAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already saved');
  }
  const newSavedPropertry = await prisma.savedPropertry.create({
    data: payload,
  });
  return newSavedPropertry;
};

const getSingleSavedPropertry = async (
  id: string
): Promise<SavedPropertry | null> => {
  const result = await prisma.savedPropertry.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSavedPropertry = async (
  id: string,
  payload: Partial<SavedPropertry>
): Promise<SavedPropertry | null> => {
  const result = await prisma.savedPropertry.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSavedPropertry = async (
  id: string
): Promise<SavedPropertry | null> => {
  const result = await prisma.savedPropertry.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SavedPropertry not found!');
  }
  return result;
};

export const SavedPropertryService = {
  getAllSavedPropertry,
  createSavedPropertry,
  updateSavedPropertry,
  getSingleSavedPropertry,
  deleteSavedPropertry,
};
