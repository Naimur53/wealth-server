import { Feedback } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { FeedbackService } from './feedback.service';
        import { feedbackFilterAbleFields } from './feedback.constant';
        const createFeedback: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const FeedbackData = req.body;
        
            const result = await FeedbackService.createFeedback(
              FeedbackData
            );
            sendResponse<Feedback>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Feedback Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllFeedback = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...feedbackFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await FeedbackService.getAllFeedback(
              filters,
              paginationOptions
            );
        
            sendResponse<Feedback[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Feedback retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleFeedback: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FeedbackService.getSingleFeedback(id);
        
            sendResponse<Feedback>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Feedback retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateFeedback: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await FeedbackService.updateFeedback(
              id,
              updateAbleData
            );
        
            sendResponse<Feedback>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Feedback Updated successfully!',
              data: result,
            });
          }
        );
        const deleteFeedback: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await FeedbackService.deleteFeedback(id);
        
            sendResponse<Feedback>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Feedback deleted successfully!',
              data: result,
            });
          }
        );
        
        export const FeedbackController = {
          getAllFeedback,
          createFeedback,
          updateFeedback,
          getSingleFeedback,
          deleteFeedback,
        };