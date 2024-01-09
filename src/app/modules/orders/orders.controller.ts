import { Orders } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OrdersService } from './orders.service';
import { ordersFilterAbleFields } from './orders.constant';
const createOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const OrdersData = req.body;

    const result = await OrdersService.createOrders(OrdersData);
    sendResponse<Orders>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders Created successfully!',
      data: result,
    });
  }
);

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...ordersFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrdersService.getAllOrders(filters, paginationOptions);

  sendResponse<Orders[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OrdersService.getSingleOrders(id);

    sendResponse<Orders>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved  successfully!',
      data: result,
    });
  }
);

const updateOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await OrdersService.updateOrders(id, updateAbleData);

    sendResponse<Orders>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders Updated successfully!',
      data: result,
    });
  }
);
const deleteOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OrdersService.deleteOrders(id);

    sendResponse<Orders>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders deleted successfully!',
      data: result,
    });
  }
);

export const OrdersController = {
  getAllOrders,
  createOrders,
  updateOrders,
  getSingleOrders,
  deleteOrders,
};
