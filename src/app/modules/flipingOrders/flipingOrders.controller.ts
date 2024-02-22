import { FlipingOrders } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { FlipingOrdersService } from './flipingOrders.service';
        import { flipingOrdersFilterAbleFields } from './flipingOrders.constant';
        const createFlipingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const FlipingOrdersData = req.body;
        
            const result = await FlipingOrdersService.createFlipingOrders(
              FlipingOrdersData
            );
            sendResponse<FlipingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlipingOrders Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllFlipingOrders = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...flipingOrdersFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await FlipingOrdersService.getAllFlipingOrders(
              filters,
              paginationOptions
            );
        
            sendResponse<FlipingOrders[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlipingOrders retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleFlipingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlipingOrdersService.getSingleFlipingOrders(id);
        
            sendResponse<FlipingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlipingOrders retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateFlipingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await FlipingOrdersService.updateFlipingOrders(
              id,
              updateAbleData
            );
        
            sendResponse<FlipingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlipingOrders Updated successfully!',
              data: result,
            });
          }
        );
        const deleteFlipingOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlipingOrdersService.deleteFlipingOrders(id);
        
            sendResponse<FlipingOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'FlipingOrders deleted successfully!',
              data: result,
            });
          }
        );
        
        export const FlipingOrdersController = {
          getAllFlipingOrders,
          createFlipingOrders,
          updateFlipingOrders,
          getSingleFlipingOrders,
          deleteFlipingOrders,
        };