import { Location } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { LocationService } from './location.service';
        import { locationFilterAbleFields } from './location.constant';
        const createLocation: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const LocationData = req.body;
        
            const result = await LocationService.createLocation(
              LocationData
            );
            sendResponse<Location>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Location Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllLocation = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...locationFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await LocationService.getAllLocation(
              filters,
              paginationOptions
            );
        
            sendResponse<Location[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Location retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleLocation: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await LocationService.getSingleLocation(id);
        
            sendResponse<Location>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Location retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateLocation: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await LocationService.updateLocation(
              id,
              updateAbleData
            );
        
            sendResponse<Location>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Location Updated successfully!',
              data: result,
            });
          }
        );
        const deleteLocation: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await LocationService.deleteLocation(id);
        
            sendResponse<Location>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Location deleted successfully!',
              data: result,
            });
          }
        );
        
        export const LocationController = {
          getAllLocation,
          createLocation,
          updateLocation,
          getSingleLocation,
          deleteLocation,
        };