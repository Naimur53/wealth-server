import { Messaage } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { MessaageService } from './messaage.service';
        import { messaageFilterAbleFields } from './messaage.constant';
        const createMessaage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const MessaageData = req.body;
        
            const result = await MessaageService.createMessaage(
              MessaageData
            );
            sendResponse<Messaage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Messaage Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllMessaage = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...messaageFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await MessaageService.getAllMessaage(
              filters,
              paginationOptions
            );
        
            sendResponse<Messaage[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Messaage retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleMessaage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await MessaageService.getSingleMessaage(id);
        
            sendResponse<Messaage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Messaage retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateMessaage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await MessaageService.updateMessaage(
              id,
              updateAbleData
            );
        
            sendResponse<Messaage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Messaage Updated successfully!',
              data: result,
            });
          }
        );
        const deleteMessaage: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await MessaageService.deleteMessaage(id);
        
            sendResponse<Messaage>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Messaage deleted successfully!',
              data: result,
            });
          }
        );
        
        export const MessaageController = {
          getAllMessaage,
          createMessaage,
          updateMessaage,
          getSingleMessaage,
          deleteMessaage,
        };