import { CrowdFund, Orders } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  crowdFundFilterAbleFields,
  crowdFundFilterByPrice,
} from './crowdFund.constant';
import { CrowdFundService } from './crowdFund.service';
const createCrowdFund: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CrowdFundData = req.body;

    const result = await CrowdFundService.createCrowdFund(CrowdFundData);
    sendResponse<CrowdFund>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CrowdFund Created successfully!',
      data: result,
    });
  }
);
const recentlyFunded: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CrowdFundService.recentlyFunded();
    sendResponse<Orders[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CrowdFund Created successfully!',
      data: result,
    });
  }
);

const getAllCrowdFund = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...crowdFundFilterAbleFields,
    ...crowdFundFilterByPrice,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CrowdFundService.getAllCrowdFund(
    filters,
    paginationOptions
  );

  sendResponse<CrowdFund[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CrowdFund retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCrowdFund: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CrowdFundService.getSingleCrowdFund(id);

    sendResponse<CrowdFund>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CrowdFund retrieved  successfully!',
      data: result,
    });
  }
);

const updateCrowdFund: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await CrowdFundService.updateCrowdFund(id, updateAbleData);

    sendResponse<CrowdFund>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CrowdFund Updated successfully!',
      data: result,
    });
  }
);
const deleteCrowdFund: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CrowdFundService.deleteCrowdFund(id);

    sendResponse<CrowdFund>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CrowdFund deleted successfully!',
      data: result,
    });
  }
);

export const CrowdFundController = {
  getAllCrowdFund,
  createCrowdFund,
  updateCrowdFund,
  getSingleCrowdFund,
  deleteCrowdFund,
  recentlyFunded,
};
