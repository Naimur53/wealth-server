import { ChatGroup } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { ChatGroupService } from './chatGroup.service';
        import { chatGroupFilterAbleFields } from './chatGroup.constant';
        const createChatGroup: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const ChatGroupData = req.body;
        
            const result = await ChatGroupService.createChatGroup(
              ChatGroupData
            );
            sendResponse<ChatGroup>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'ChatGroup Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllChatGroup = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...chatGroupFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await ChatGroupService.getAllChatGroup(
              filters,
              paginationOptions
            );
        
            sendResponse<ChatGroup[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'ChatGroup retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleChatGroup: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await ChatGroupService.getSingleChatGroup(id);
        
            sendResponse<ChatGroup>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'ChatGroup retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateChatGroup: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await ChatGroupService.updateChatGroup(
              id,
              updateAbleData
            );
        
            sendResponse<ChatGroup>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'ChatGroup Updated successfully!',
              data: result,
            });
          }
        );
        const deleteChatGroup: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await ChatGroupService.deleteChatGroup(id);
        
            sendResponse<ChatGroup>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'ChatGroup deleted successfully!',
              data: result,
            });
          }
        );
        
        export const ChatGroupController = {
          getAllChatGroup,
          createChatGroup,
          updateChatGroup,
          getSingleChatGroup,
          deleteChatGroup,
        };