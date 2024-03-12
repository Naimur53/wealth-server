import {
  EOrderPaymentType,
  EOrderStatus,
  Orders,
  UserRole,
} from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import prisma from '../../../shared/prisma';
import sendResponse from '../../../shared/sendResponse';
import { ordersFilterAbleFields } from './orders.constant';
import { OrdersService } from './orders.service';

const createOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const OrdersData = req.body;
    const user = req.user as JwtPayload;

    // if payment type is manual
    if (OrdersData.paymentType === EOrderPaymentType.manual) {
      // check does user give all info for manual
      const keys = ['bankName', 'bankAccountNumber', 'wealthBankId'];
      keys.forEach(single => {
        if (!OrdersData[single]?.length) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Manual payment required' + ' ' + single
          );
        }
      });
    }
    // else {
    //   if (!OrdersData.wealthBankId) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'wealthBankId is required');
    //   }
    // }
    const result = await OrdersService.createOrders({
      ...OrdersData,
      status: EOrderStatus.pending,
      orderById: user.userId,
    });
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
    const user = req.user as JwtPayload;
    const isNotAdmin = user.role !== UserRole.admin;
    const isNotSuperAdmin = user.role !== UserRole.superAdmin;
    const isOrderExits = await prisma.orders.findUnique({
      where: { id: id },
      select: { orderById: true },
    });
    if (!isOrderExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }
    const isNotOwner = isOrderExits.orderById !== user.userId;
    if (isNotAdmin && isNotSuperAdmin && isNotOwner) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are not the owner');
    }
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
