import { SavedFlipping } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SavedFlippingService } from './savedFlipping.service';
const createSavedFlipping: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const SavedFlippingData = req.body;
    const user = req.user as JwtPayload;
    const result = await SavedFlippingService.createSavedFlipping({
      ...SavedFlippingData,
      ownById: user.userId,
    });
    sendResponse<SavedFlipping>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedFlipping Created successfully!',
      data: result,
    });
  }
);

const getAllSavedFlipping = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await SavedFlippingService.getAllSavedFlipping(user.userId);

  sendResponse<SavedFlipping[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SavedFlipping retrieved successfully !',
    data: result,
  });
});

const getSingleSavedFlipping: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SavedFlippingService.getSingleSavedFlipping(id);

    sendResponse<SavedFlipping>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedFlipping retrieved  successfully!',
      data: result,
    });
  }
);

const updateSavedFlipping: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await SavedFlippingService.updateSavedFlipping(
      id,
      updateAbleData
    );

    sendResponse<SavedFlipping>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedFlipping Updated successfully!',
      data: result,
    });
  }
);
const deleteSavedFlipping: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SavedFlippingService.deleteSavedFlipping(id);

    sendResponse<SavedFlipping>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedFlipping deleted successfully!',
      data: result,
    });
  }
);

export const SavedFlippingController = {
  getAllSavedFlipping,
  createSavedFlipping,
  updateSavedFlipping,
  getSingleSavedFlipping,
  deleteSavedFlipping,
};
