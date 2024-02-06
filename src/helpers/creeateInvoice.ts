import { InvoiceReturn } from '@nowpaymentsio/nowpayments-api-js/src/actions/create-invoice';
import axios from 'axios';
import config from '../config';

const createNowPayInvoice = async (invoice: {
  price_amount: number;
  ipn_callback_url: string;
  order_id: string;
  order_description?: string;
  success_url: string;
  cancel_url: string;
}): Promise<InvoiceReturn> => {
  const nowPaymentsApiKey = config.nowPaymentApiKey || ''; // Use your sandbox API key
  console.log(invoice);
  // Use the sandbox API URL
  const sandboxApiUrl = config.nowPaymentInvoiceUrl || '';

  console.log({ nowPaymentsApiKey, sandboxApiUrl });
  const response = await axios.post(
    sandboxApiUrl,
    {
      ...invoice,
      ipn_callback_url: invoice.ipn_callback_url
        ? config.baseServerUrl + invoice.ipn_callback_url
        : undefined,
      price_currency: 'USD',
      pay_currency: 'BTC',
    },
    {
      headers: {
        'x-api-key': nowPaymentsApiKey,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(response.data);
  return response.data;
};
export default createNowPayInvoice;
