import { CrowdFundOrders } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { CrowdFundOrdersService } from './crowdFundOrders.service';
        import { crowdFundOrdersFilterAbleFields } from './crowdFundOrders.constant';
        const createCrowdFundOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const CrowdFundOrdersData = req.body;
        
            const result = await CrowdFundOrdersService.createCrowdFundOrders(
              CrowdFundOrdersData
            );
            sendResponse<CrowdFundOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'CrowdFundOrders Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllCrowdFundOrders = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...crowdFundOrdersFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await CrowdFundOrdersService.getAllCrowdFundOrders(
              filters,
              paginationOptions
            );
        
            sendResponse<CrowdFundOrders[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'CrowdFundOrders retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleCrowdFundOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await CrowdFundOrdersService.getSingleCrowdFundOrders(id);
        
            sendResponse<CrowdFundOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'CrowdFundOrders retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateCrowdFundOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await CrowdFundOrdersService.updateCrowdFundOrders(
              id,
              updateAbleData
            );
        
            sendResponse<CrowdFundOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'CrowdFundOrders Updated successfully!',
              data: result,
            });
          }
        );
        const deleteCrowdFundOrders: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await CrowdFundOrdersService.deleteCrowdFundOrders(id);
        
            sendResponse<CrowdFundOrders>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'CrowdFundOrders deleted successfully!',
              data: result,
            });
          }
        );
        
        export const CrowdFundOrdersController = {
          getAllCrowdFundOrders,
          createCrowdFundOrders,
          updateCrowdFundOrders,
          getSingleCrowdFundOrders,
          deleteCrowdFundOrders,
        };