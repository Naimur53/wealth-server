import { Prisma, PropertyState } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { propertyStateFilterAbleFields } from './propertyState.constant';
import { PropertyStateService } from './propertyState.service';
const createPropertyState: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const PropertyStateData = req.body;

    const result = await PropertyStateService.createPropertyState(
      PropertyStateData
    );
    sendResponse<PropertyState>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PropertyState Created successfully!',
      data: result,
    });
  }
);
const createMultiPropertyState: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const PropertyStateData = req.body;

    const result = await PropertyStateService.createMultiPropertyState(
      PropertyStateData
    );
    sendResponse<Prisma.BatchPayload>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PropertyState Created successfully!',
      data: result,
    });
  }
);

// const getSingleAllPropertyState = catchAsync(
//   async (req: Request, res: Response) => {
//     const info = req.body;
//     const result = await PropertyStateService.getSingleAllPropertyState(
//       info.id,
//       info.type
//     );

//     sendResponse<PropertyState[]>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'PropertyState retrieved successfully !',
//       data: result,
//     });
//   }
// );
const getAllPropertyState = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...propertyStateFilterAbleFields,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PropertyStateService.getAllPropertyState(
    filters,
    paginationOptions
  );

  sendResponse<PropertyState[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PropertyState retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePropertyState: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PropertyStateService.getSinglePropertyState(id);

    sendResponse<PropertyState>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PropertyState retrieved  successfully!',
      data: result,
    });
  }
);

const updatePropertyState: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await PropertyStateService.updatePropertyState(
      id,
      updateAbleData
    );

    sendResponse<PropertyState>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PropertyState Updated successfully!',
      data: result,
    });
  }
);
const deletePropertyState: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PropertyStateService.deletePropertyState(id);

    sendResponse<PropertyState>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'PropertyState deleted successfully!',
      data: result,
    });
  }
);

export const PropertyStateController = {
  getAllPropertyState,
  createPropertyState,
  updatePropertyState,
  getSinglePropertyState,
  deletePropertyState,
  createMultiPropertyState,
};
