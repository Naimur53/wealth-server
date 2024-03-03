import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

/* eslint-disable @typescript-eslint/no-explicit-any */
const payStackUserPaySuccess = async (userId: string) => {
  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found to update!');
  }
  const upateUser = await prisma.user.update({
    where: { id: userId },
    data: { isPaid: true },
  });
  return upateUser;
  //   return datas;
};
export const webHookService = {
  payStackUserPaySuccess,
};
