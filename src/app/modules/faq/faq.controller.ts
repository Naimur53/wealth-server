import { Faq } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';
const createFaq: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const FaqData = req.body;

    const result = await FaqService.createFaq(FaqData);
    sendResponse<Faq>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faq Created successfully!',
      data: result,
    });
  }
);

const getAllFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getAllFaq();

  sendResponse<Faq[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faq retrieved successfully !',
    data: result,
  });
});

const getSingleFaq: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await FaqService.getSingleFaq(id);

    sendResponse<Faq>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faq retrieved  successfully!',
      data: result,
    });
  }
);

const updateFaq: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await FaqService.updateFaq(id, updateAbleData);

    sendResponse<Faq>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faq Updated successfully!',
      data: result,
    });
  }
);
const deleteFaq: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await FaqService.deleteFaq(id);

    sendResponse<Faq>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faq deleted successfully!',
      data: result,
    });
  }
);

export const FaqController = {
  getAllFaq,
  createFaq,
  updateFaq,
  getSingleFaq,
  deleteFaq,
};
