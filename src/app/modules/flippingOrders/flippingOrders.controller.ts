import { FlippingOrders } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { FlippingOrdersService } from './flippingOrders.service';
        import { flippingOrdersFilterAbleFields } from './flippingOrders.constant';
        const createFlippingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const FlippingOrdersData = req.body;
        
            const result = await FlippingOrdersService.createFlippingOrders(
              FlippingOrdersData
            );
            sendResponse<FlippingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlippingOrders Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllFlippingOrders = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...flippingOrdersFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await FlippingOrdersService.getAllFlippingOrders(
              filters,
              paginationOptions
            );
        
            sendResponse<FlippingOrders[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlippingOrders retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleFlippingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlippingOrdersService.getSingleFlippingOrders(id);
        
            sendResponse<FlippingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlippingOrders retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateFlippingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await FlippingOrdersService.updateFlippingOrders(
              id,
              updateAbleData
            );
        
            sendResponse<FlippingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlippingOrders Updated successfully!',
              data: result,
            });
          }
        );
        const deleteFlippingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlippingOrdersService.deleteFlippingOrders(id);
        
            sendResponse<FlippingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlippingOrders deleted successfully!',
              data: result,
            });
          }
        );
        
        export const FlippingOrdersController = {
          getAllFlippingOrders,
          createFlippingOrders,
          updateFlippingOrders,
          getSingleFlippingOrders,
          deleteFlippingOrders,
        };