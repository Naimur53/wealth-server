import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { EPaymentType } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { webHookService } from './webhook.service';

const paystack: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;
    if (ipnData.event === 'charge.success') {
      const paymentReference = ipnData.data.reference;

      // Perform additional actions, such as updating your database, sending emails, etc.
      const paymentType = ipnData?.data?.metadata?.payment_type;

      if (paymentType === EPaymentType.addFunds) {
        // await CurrencyRequestService.payStackWebHook({
        //   reference: paymentReference,
        // });
      } else if (paymentType === EPaymentType.user) {
        await webHookService.payStackUserPaySuccess(paymentReference);
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

export const webHookController = {
  paystack,
};
