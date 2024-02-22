import { SavedFlipping } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { SavedFlippingService } from './savedFlipping.service';
        import { savedFlippingFilterAbleFields } from './savedFlipping.constant';
        const createSavedFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const SavedFlippingData = req.body;
        
            const result = await SavedFlippingService.createSavedFlipping(
              SavedFlippingData
            );
            sendResponse<SavedFlipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFlipping Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllSavedFlipping = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...savedFlippingFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await SavedFlippingService.getAllSavedFlipping(
              filters,
              paginationOptions
            );
        
            sendResponse<SavedFlipping[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFlipping retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleSavedFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SavedFlippingService.getSingleSavedFlipping(id);
        
            sendResponse<SavedFlipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFlipping retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateSavedFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await SavedFlippingService.updateSavedFlipping(
              id,
              updateAbleData
            );
        
            sendResponse<SavedFlipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFlipping Updated successfully!',
              data: result,
            });
          }
        );
        const deleteSavedFlipping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SavedFlippingService.deleteSavedFlipping(id);
        
            sendResponse<SavedFlipping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFlipping deleted successfully!',
              data: result,
            });
          }
        );
        
        export const SavedFlippingController = {
          getAllSavedFlipping,
          createSavedFlipping,
          updateSavedFlipping,
          getSingleSavedFlipping,
          deleteSavedFlipping,
        };