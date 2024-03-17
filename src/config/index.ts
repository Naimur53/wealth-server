/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_secret_signup: process.env.JWT_REFRESH_SECRET_SIGNUP,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  emailUserPass: process.env.EMAIL_USER_PASS,
  emailUser: process.env.EMAIL_USER,
  mainAdminEmail: process.env.MAIN_ADMIN_EMAIL,
  frontendUrl: process.env.FRONT_END_URL,
  sellerOneTimePayment: parseFloat(
    process.env.SELLER_ONE_TIME_PAYMENT as string
  ),
  currencyPerDollar: parseFloat(process.env.CURRENCY_PER_DOLLAR as string),

  dollarRate: parseFloat(process.env.DOLLAR_RATE as string),
  paystackPaymentApiKey: process.env.PAYSTACK_PAYMENT_API_KEY,

  mainLogo: process.env.MAIN_LOGO,
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  oneSignalID: process.env.ONESIGNAL_ID as string,
  oneSignalApi: process.env.ONESIGNAL_API as string,
};
