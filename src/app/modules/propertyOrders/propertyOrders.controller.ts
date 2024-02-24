import { PropertyOrders } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { PropertyOrdersService } from './propertyOrders.service';
        import { propertyOrdersFilterAbleFields } from './propertyOrders.constant';
        const createPropertyOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const PropertyOrdersData = req.body;
        
            const result = await PropertyOrdersService.createPropertyOrders(
              PropertyOrdersData
            );
            sendResponse<PropertyOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertyOrders Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllPropertyOrders = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...propertyOrdersFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await PropertyOrdersService.getAllPropertyOrders(
              filters,
              paginationOptions
            );
        
            sendResponse<PropertyOrders[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertyOrders retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSinglePropertyOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PropertyOrdersService.getSinglePropertyOrders(id);
        
            sendResponse<PropertyOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertyOrders retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updatePropertyOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await PropertyOrdersService.updatePropertyOrders(
              id,
              updateAbleData
            );
        
            sendResponse<PropertyOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertyOrders Updated successfully!',
              data: result,
            });
          }
        );
        const deletePropertyOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await PropertyOrdersService.deletePropertyOrders(id);
        
            sendResponse<PropertyOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'PropertyOrders deleted successfully!',
              data: result,
            });
          }
        );
        
        export const PropertyOrdersController = {
          getAllPropertyOrders,
          createPropertyOrders,
          updatePropertyOrders,
          getSinglePropertyOrders,
          deletePropertyOrders,
        };