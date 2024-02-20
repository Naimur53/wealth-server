import { User } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from '../user/user.service';

const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;
    const result = await UserService.getSingleUser(userId);
    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  }
);

export const ProfileController = {
  getProfile,
};
