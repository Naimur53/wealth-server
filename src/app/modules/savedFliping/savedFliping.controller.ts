import { SavedFliping } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { SavedFlipingService } from './savedFliping.service';
        import { savedFlipingFilterAbleFields } from './savedFliping.constant';
        const createSavedFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const SavedFlipingData = req.body;
        
            const result = await SavedFlipingService.createSavedFliping(
              SavedFlipingData
            );
            sendResponse<SavedFliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFliping Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllSavedFliping = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...savedFlipingFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await SavedFlipingService.getAllSavedFliping(
              filters,
              paginationOptions
            );
        
            sendResponse<SavedFliping[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFliping retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleSavedFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SavedFlipingService.getSingleSavedFliping(id);
        
            sendResponse<SavedFliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFliping retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateSavedFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await SavedFlipingService.updateSavedFliping(
              id,
              updateAbleData
            );
        
            sendResponse<SavedFliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFliping Updated successfully!',
              data: result,
            });
          }
        );
        const deleteSavedFliping: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SavedFlipingService.deleteSavedFliping(id);
        
            sendResponse<SavedFliping>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SavedFliping deleted successfully!',
              data: result,
            });
          }
        );
        
        export const SavedFlipingController = {
          getAllSavedFliping,
          createSavedFliping,
          updateSavedFliping,
          getSingleSavedFliping,
          deleteSavedFliping,
        };