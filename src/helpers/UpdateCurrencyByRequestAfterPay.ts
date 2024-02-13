import { EStatusOfCurrencyRequest } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';
import EmailTemplates from '../shared/EmailTemplates';
import prisma from '../shared/prisma';
import sendEmail from './sendEmail';

const UpdateCurrencyByRequestAfterPay = async (data: {
  order_id: string;
  payment_status: string;
  price_amount: number;
}) => {
  try {
    await prisma.$transaction(async tx => {
      // check is request exits
      const isCurrencyRequestExits = await tx.currencyRequest.findUnique({
        where: { id: data.order_id },
        include: {
          ownBy: { include: { Currency: true } },
        },
      });
      if (!isCurrencyRequestExits || !isCurrencyRequestExits.ownBy) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
      }
      // user previous currency
      const isUserCurrencyExist = await tx.currency.findUnique({
        where: { ownById: isCurrencyRequestExits.ownById },
      });
      if (!isUserCurrencyExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Currency not found!');
      }
      // change status to approved
      if (isCurrencyRequestExits.status === EStatusOfCurrencyRequest.pending) {
        //
        await tx.currencyRequest.update({
          where: { id: data.order_id },
          data: {
            status: EStatusOfCurrencyRequest.approved,
            paymentStatus: data.payment_status,
          },
        });
        // add money to user
        await tx.currency.update({
          where: { ownById: isCurrencyRequestExits.ownById },
          data: {
            amount: {
              increment: data.price_amount,
            },
          },
        });
      }
    });
  } catch (err) {
    await sendEmail(
      { to: config.emailUser || '' },
      {
        subject: EmailTemplates.currencyRequestPaymentSuccessButFailed.subject,
        html: EmailTemplates.currencyRequestPaymentSuccessButFailed.html({
          failedSavedData: JSON.stringify(data),
        }),
      }
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went worg');
  }
};
export default UpdateCurrencyByRequestAfterPay;
