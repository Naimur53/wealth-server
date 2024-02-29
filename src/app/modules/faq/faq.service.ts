import { Faq } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllFaq = async (): Promise<Faq[]> => {
  const result = await prisma.faq.findMany({});

  return result;
};

const createFaq = async (payload: Faq): Promise<Faq | null> => {
  const newFaq = await prisma.faq.create({
    data: payload,
  });
  return newFaq;
};

const getSingleFaq = async (id: string): Promise<Faq | null> => {
  const result = await prisma.faq.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateFaq = async (
  id: string,
  payload: Partial<Faq>
): Promise<Faq | null> => {
  const result = await prisma.faq.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFaq = async (id: string): Promise<Faq | null> => {
  const result = await prisma.faq.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found!');
  }
  return result;
};

export const FaqService = {
  getAllFaq,
  createFaq,
  updateFaq,
  getSingleFaq,
  deleteFaq,
};
