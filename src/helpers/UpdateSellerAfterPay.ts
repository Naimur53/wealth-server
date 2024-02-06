import httpStatus from 'http-status';
import { AuthService } from '../app/modules/auth/auth.service';
import config from '../config';
import ApiError from '../errors/ApiError';
import EmailTemplates from '../shared/EmailTemplates';
import prisma from '../shared/prisma';
import sendEmail from './sendEmail';

const UpdateSellerAfterPay = async (data: {
  order_id: string;
  payment_status: string;
  price_amount: number;
}) => {
  const isSellerExits = await prisma.user.findUnique({
    where: { id: data.order_id },
  });
  if (!isSellerExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (isSellerExits.isApprovedForSeller && isSellerExits.isPaidForSeller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User already been approved for seller and paid'
    );
  }
  await prisma.user.update({
    where: { id: isSellerExits.id },
    data: { isPaidForSeller: true, isApprovedForSeller: true },
  });
  await prisma.$transaction(async tx => {
    // update admin
    try {
      const isAdminExist = await tx.user.findUnique({
        where: { email: config.mainAdminEmail },
        include: { Currency: true },
      });
      if (!isAdminExist || !isAdminExist.Currency) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Admin doesn't exits");
      }
      // update amount
      await tx.currency.update({
        where: { ownById: isAdminExist.id },
        data: {
          amount: isAdminExist.Currency?.amount + config.sellerOneTimePayment,
        },
      });
    } catch (err) {
      console.log('something went wrong to findteh admin ');
    }
    // send verification token
    const output = await AuthService.resendEmail(isSellerExits.email);
    const { refreshToken, ...result } = output;
    await sendEmail(
      { to: result.user.email },
      {
        subject: EmailTemplates.verify.subject,
        html: EmailTemplates.verify.html({ token: refreshToken as string }),
      }
    );
  });
};
export default UpdateSellerAfterPay;
