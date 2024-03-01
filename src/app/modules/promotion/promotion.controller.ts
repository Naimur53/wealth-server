import { Promotion, PromotionInterest } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PromotionService } from './promotion.service';
const createPromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const PromotionData = req.body;

    const result = await PromotionService.createPromotion(PromotionData);
    sendResponse<Promotion>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion Created successfully!',
      data: result,
    });
  }
);
const addInterestInPromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const promotionInterest = req.body;
    const user = req.user as JwtPayload;
    const result = await PromotionService.addInterestInPromotion({
      ...promotionInterest,
      userId: user.userId,
    });
    sendResponse<PromotionInterest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion Created successfully!',
      data: result,
    });
  }
);
const removeInterestInPromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const promotionInterest = req.body;
    const user = req.user as JwtPayload;
    const result = await PromotionService.removeInterestInPromotion({
      ...promotionInterest,
      userId: user.userId,
    });
    sendResponse<PromotionInterest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion deleted successfully!',
      data: result,
    });
  }
);

const getAllPromotion = catchAsync(async (req: Request, res: Response) => {
  const result = await PromotionService.getAllPromotion();

  sendResponse<Promotion[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion retrieved successfully !',
    data: result,
  });
});

const getSinglePromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PromotionService.getSinglePromotion(id);

    sendResponse<Promotion>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion retrieved  successfully!',
      data: result,
    });
  }
);

const updatePromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await PromotionService.updatePromotion(id, updateAbleData);

    sendResponse<Promotion>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion Updated successfully!',
      data: result,
    });
  }
);
const deletePromotion: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PromotionService.deletePromotion(id);

    sendResponse<Promotion>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Promotion deleted successfully!',
      data: result,
    });
  }
);

export const PromotionController = {
  getAllPromotion,
  createPromotion,
  updatePromotion,
  getSinglePromotion,
  deletePromotion,
  addInterestInPromotion,
  removeInterestInPromotion,
};
