import { Flipping } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { FlippingService } from './flipping.service';
        import { flippingFilterAbleFields } from './flipping.constant';
        const createFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const FlippingData = req.body;
        
            const result = await FlippingService.createFlipping(
              FlippingData
            );
            sendResponse<Flipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Flipping Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllFlipping = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...flippingFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await FlippingService.getAllFlipping(
              filters,
              paginationOptions
            );
        
            sendResponse<Flipping[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Flipping retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlippingService.getSingleFlipping(id);
        
            sendResponse<Flipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Flipping retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await FlippingService.updateFlipping(
              id,
              updateAbleData
            );
        
            sendResponse<Flipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Flipping Updated successfully!',
              data: result,
            });
          }
        );
        const deleteFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FlippingService.deleteFlipping(id);
        
            sendResponse<Flipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Flipping deleted successfully!',
              data: result,
            });
          }
        );
        
        export const FlippingController = {
          getAllFlipping,
          createFlipping,
          updateFlipping,
          getSingleFlipping,
          deleteFlipping,
        };