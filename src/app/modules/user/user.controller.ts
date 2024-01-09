import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterAbleFields } from './user.constant';
import { UserService } from './user.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const UserData = req.body;

    const result = await UserService.createUser(UserData);
    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Created successfully!',
      data: result,
    });
  }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...userFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await UserService.getAllUser(filters, paginationOptions);

  sendResponse<Omit<User, 'password'>[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched  successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.getSingleUser(id);

    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully!',
      data: result,
    });
  }
);

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await UserService.updateUser(id, updateAbleData);

    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Updated successfully!',
      data: result,
    });
  }
);
const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.deleteUser(id);

    sendResponse<User>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully!',
      data: result,
    });
  }
);

export const UserController = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
};
