import { Fliping } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { FlipingService } from './fliping.service';
        import { flipingFilterAbleFields } from './fliping.constant';
        const createFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const FlipingData = req.body;
        
            const result = await FlipingService.createFliping(
              FlipingData
            );
            sendResponse<Fliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Fliping Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllFliping = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...flipingFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await FlipingService.getAllFliping(
              filters,
              paginationOptions
            );
        
            sendResponse<Fliping[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Fliping retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlipingService.getSingleFliping(id);
        
            sendResponse<Fliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Fliping retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await FlipingService.updateFliping(
              id,
              updateAbleData
            );
        
            sendResponse<Fliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Fliping Updated successfully!',
              data: result,
            });
          }
        );
        const deleteFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlipingService.deleteFliping(id);
        
            sendResponse<Fliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Fliping deleted successfully!',
              data: result,
            });
          }
        );
        
        export const FlipingController = {
          getAllFliping,
          createFliping,
          updateFliping,
          getSingleFliping,
          deleteFliping,
        };