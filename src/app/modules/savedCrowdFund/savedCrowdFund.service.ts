import { SavedCrowdFund } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllSavedCrowdFund = async (
  userId: string
): Promise<SavedCrowdFund[]> => {
  const output = await prisma.savedCrowdFund.findMany({
    where: { ownById: userId },
    include: {
      crowdFund: true,
    },
  });
  return output;
};

const createSavedCrowdFund = async (
  payload: SavedCrowdFund
): Promise<SavedCrowdFund | null> => {
  const isCrowdFundExits = await prisma.crowdFund.findUnique({
    where: { id: payload.crowdFundId },
  });
  if (!isCrowdFundExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Crowd fund is not exits');
  }
  // check already saved ?
  const isAlreadyExist = await prisma.savedCrowdFund.findFirst({
    where: {
      ownById: payload.ownById,
      crowdFundId: payload.crowdFundId,
    },
  });
  if (isAlreadyExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already saved');
  }
  const newSavedCrowdFund = await prisma.savedCrowdFund.create({
    data: payload,
  });
  return newSavedCrowdFund;
};

const getSingleSavedCrowdFund = async (
  id: string
): Promise<SavedCrowdFund | null> => {
  const result = await prisma.savedCrowdFund.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSavedCrowdFund = async (
  id: string,
  payload: Partial<SavedCrowdFund>
): Promise<SavedCrowdFund | null> => {
  const result = await prisma.savedCrowdFund.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSavedCrowdFund = async (
  id: string
): Promise<SavedCrowdFund | null> => {
  const result = await prisma.savedCrowdFund.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SavedCrowdFund not found!');
  }
  return result;
};

export const SavedCrowdFundService = {
  getAllSavedCrowdFund,
  createSavedCrowdFund,
  updateSavedCrowdFund,
  getSingleSavedCrowdFund,
  deleteSavedCrowdFund,
};
