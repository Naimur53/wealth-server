import { Property } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  propertyFilterAbleFields,
  propertyFilterByPrice,
} from './property.constant';
import { PropertyService } from './property.service';
const createProperty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const PropertyData = req.body;

    const result = await PropertyService.createProperty(PropertyData);
    sendResponse<Property>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property Created successfully!',
      data: result,
    });
  }
);

const getAllProperty = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...propertyFilterAbleFields,
    ...propertyFilterByPrice,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PropertyService.getAllProperty(
    filters,
    paginationOptions
  );

  sendResponse<Property[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Property retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PropertyService.getSingleProperty(id);
    sendResponse<Property>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property retrieved  successfully!',
      data: result,
    });
  }
);

const updateProperty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await PropertyService.updateProperty(id, updateAbleData);

    sendResponse<Property>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property Updated successfully!',
      data: result,
    });
  }
);
const deleteProperty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PropertyService.deleteProperty(id);

    sendResponse<Property>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property deleted successfully!',
      data: result,
    });
  }
);

export const PropertyController = {
  getAllProperty,
  createProperty,
  updateProperty,
  getSingleProperty,
  deleteProperty,
};
