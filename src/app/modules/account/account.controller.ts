import { Account } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AccountService } from './account.service';
import { accountFilterAbleFields } from './account.constant';
const createAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const AccountData = req.body;

    const result = await AccountService.createAccount(AccountData);
    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account Created successfully!',
      data: result,
    });
  }
);

const getAllAccount = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...accountFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AccountService.getAllAccount(filters, paginationOptions);

  sendResponse<Account[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AccountService.getSingleAccount(id);

    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account retrieved  successfully!',
      data: result,
    });
  }
);

const updateAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await AccountService.updateAccount(id, updateAbleData);

    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account Updated successfully!',
      data: result,
    });
  }
);
const deleteAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AccountService.deleteAccount(id);

    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account deleted successfully!',
      data: result,
    });
  }
);

export const AccountController = {
  getAllAccount,
  createAccount,
  updateAccount,
  getSingleAccount,
  deleteAccount,
};
