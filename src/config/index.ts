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
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  emailUserPass: process.env.EMAIL_USER_PASS,
  emailUser: process.env.EMAIL_USER,
  mainAdminEmail: process.env.EMAIL_USER,
  frontendUrl: process.env.FRONT_END_URL,
  currencyPerDollar: parseFloat(process.env.CURRENCY_PER_DOLLAR as string),
  withdrawalPercentage: parseFloat(process.env.WITHDRAWAL_PERCENTAGE as string),
  withdrawalMinMoney: parseFloat(process.env.WITHDRAWAL_MIN_MONEY as string),
  withdrawalMaxMoney: parseFloat(process.env.WITHDRAWAL_MAX_MONEY as string),
  calculationMoneyRound: parseInt(
    process.env.CALCULATION_MONEY_ROUND as string
  ),
  accountSellPercentage: parseFloat(
    process.env.ACCOUNT_SELL_PERCENTAGE as string
  ),
  nowPaymentApiKey: process.env.NOW_PAYMENT_API_KEY,
};
