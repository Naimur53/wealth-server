import { PropertryOrders } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { PropertryOrdersService } from './propertryOrders.service';
        import { propertryOrdersFilterAbleFields } from './propertryOrders.constant';
        const createPropertryOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const PropertryOrdersData = req.body;
        
            const result = await PropertryOrdersService.createPropertryOrders(
              PropertryOrdersData
            );
            sendResponse<PropertryOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertryOrders Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllPropertryOrders = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...propertryOrdersFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await PropertryOrdersService.getAllPropertryOrders(
              filters,
              paginationOptions
            );
        
            sendResponse<PropertryOrders[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertryOrders retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSinglePropertryOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PropertryOrdersService.getSinglePropertryOrders(id);
        
            sendResponse<PropertryOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertryOrders retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updatePropertryOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await PropertryOrdersService.updatePropertryOrders(
              id,
              updateAbleData
            );
        
            sendResponse<PropertryOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertryOrders Updated successfully!',
              data: result,
            });
          }
        );
        const deletePropertryOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PropertryOrdersService.deletePropertryOrders(id);
        
            sendResponse<PropertryOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertryOrders deleted successfully!',
              data: result,
            });
          }
        );
        
        export const PropertryOrdersController = {
          getAllPropertryOrders,
          createPropertryOrders,
          updatePropertryOrders,
          getSinglePropertryOrders,
          deletePropertryOrders,
        };