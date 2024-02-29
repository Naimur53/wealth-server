import { SavedPropertry } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SavedPropertryService } from './savedPropertry.service';
const createSavedPropertry: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const SavedPropertryData = req.body;
    const user = req.user as JwtPayload;
    const result = await SavedPropertryService.createSavedPropertry({
      ...SavedPropertryData,
      ownById: user.userId,
    });
    sendResponse<SavedPropertry>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedPropertry Created successfully!',
      data: result,
    });
  }
);

const getAllSavedPropertry = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await SavedPropertryService.getAllSavedPropertry(user.userId);

  sendResponse<SavedPropertry[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SavedPropertry retrieved successfully !',
    data: result,
  });
});

const getSingleSavedPropertry: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SavedPropertryService.getSingleSavedPropertry(id);

    sendResponse<SavedPropertry>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedPropertry retrieved  successfully!',
      data: result,
    });
  }
);

const updateSavedPropertry: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await SavedPropertryService.updateSavedPropertry(
      id,
      updateAbleData
    );

    sendResponse<SavedPropertry>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedPropertry Updated successfully!',
      data: result,
    });
  }
);
const deleteSavedPropertry: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SavedPropertryService.deleteSavedPropertry(id);

    sendResponse<SavedPropertry>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SavedPropertry deleted successfully!',
      data: result,
    });
  }
);

export const SavedPropertryController = {
  getAllSavedPropertry,
  createSavedPropertry,
  updateSavedPropertry,
  getSingleSavedPropertry,
  deleteSavedPropertry,
};
