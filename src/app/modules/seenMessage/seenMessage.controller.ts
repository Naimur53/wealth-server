import { SeenMessage } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { SeenMessageService } from './seenMessage.service';
        import { seenMessageFilterAbleFields } from './seenMessage.constant';
        const createSeenMessage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const SeenMessageData = req.body;
        
            const result = await SeenMessageService.createSeenMessage(
              SeenMessageData
            );
            sendResponse<SeenMessage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SeenMessage Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllSeenMessage = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...seenMessageFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await SeenMessageService.getAllSeenMessage(
              filters,
              paginationOptions
            );
        
            sendResponse<SeenMessage[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SeenMessage retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleSeenMessage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SeenMessageService.getSingleSeenMessage(id);
        
            sendResponse<SeenMessage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SeenMessage retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateSeenMessage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await SeenMessageService.updateSeenMessage(
              id,
              updateAbleData
            );
        
            sendResponse<SeenMessage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SeenMessage Updated successfully!',
              data: result,
            });
          }
        );
        const deleteSeenMessage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await SeenMessageService.deleteSeenMessage(id);
        
            sendResponse<SeenMessage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'SeenMessage deleted successfully!',
              data: result,
            });
          }
        );
        
        export const SeenMessageController = {
          getAllSeenMessage,
          createSeenMessage,
          updateSeenMessage,
          getSingleSeenMessage,
          deleteSeenMessage,
        };