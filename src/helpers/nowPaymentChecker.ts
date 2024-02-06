import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';

const nowPaymentChecker = async (payment_id: number) => {
  const nowPaymentsApiKey = config.nowPaymentApiKey || '';
  const defaultUrl = config.nowPaymentInvoiceUrl || '';
  const url = defaultUrl.replace('/invoice', '/payment');
  const outputUrl = url + '/' + payment_id;
  try {
    const ouputof = await axios.get(outputUrl, {
      headers: {
        'x-api-key': nowPaymentsApiKey,
        'Content-Type': 'application/json',
      },
    });
    console.log('outputof', ouputof.data);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

export default nowPaymentChecker;
