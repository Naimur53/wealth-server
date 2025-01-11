import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { EPaymentType } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrdersService } from '../orders/orders.service';
import { webHookService } from './webhook.service';

const paystack: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;
    if (ipnData.event === 'charge.success') {
      // const paymentReference = ipnData.data.reference;

      // Perform additional actions, such as updating your database, sending emails, etc.
      const paymentType = ipnData?.data?.metadata?.payment_type;
      const orderId = ipnData?.data?.metadata?.orderId;

      if (paymentType === EPaymentType.order) {
        // await CurrencyRequestService.payStackWebHook({
        //   reference: paymentReference,
        // });
        await OrdersService.updateOrders(orderId, {
          status: 'success',
          isPaid: true,
        });
      } else if (paymentType === EPaymentType.user) {
        await webHookService.payStackUserPaySuccess(orderId);
      }
    }
    // const result = await webHookService.payStack(UserData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'successfull!',
      data: 'success',
    });
  }
);
const aiSupport: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // const user = req.user as JwtPayload;
    const message = req.body.message;
    if (!message) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide message');
    }
    // const data = await webHookService.aiSupport(user.userId, message);
    const data = await webHookService.googleAiSupport(message);
    // const result = await webHookService.payStack(UserData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'successfull!',
      data,
    });
  }
);
const dollarRate: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'successfull!',
      data: { dollarRate: config.dollarRate },
    });
  }
);

export const webHookController = {
  paystack,
  aiSupport,
  dollarRate,
};
