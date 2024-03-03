import { User } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from '../user/user.service';

const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const result = await UserService.getSingleUser(userId);
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...rest } = result;
    sendResponse<Omit<User, 'password'>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      data: rest,
    });
  }
);

export const ProfileController = {
  getProfile,
};
