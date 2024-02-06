import express from 'express';
import { AccountRoutes } from '../modules/account/account.router';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CartRoutes } from '../modules/cart/cart.router';
import { CurrencyRoutes } from '../modules/currency/currency.router';
import { CurrencyRequestRoutes } from '../modules/currencyRequest/currencyRequest.router';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { OrdersRoutes } from '../modules/orders/orders.router';
import { ProfileRoutes } from '../modules/profile/profile.router';
import { UserRoutes } from '../modules/user/user.router';
import { WithdrawalRequestRoutes } from '../modules/withdrawalRequest/withdrawalRequest.router';
const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/accounts',
    route: AccountRoutes,
  },

  {
    path: '/order',
    route: OrdersRoutes,
  },

  {
    path: '/cart',
    route: CartRoutes,
  },
  {
    path: '/currency',
    route: CurrencyRoutes,
  },
  {
    path: '/currency-request',
    route: CurrencyRequestRoutes,
  },
  {
    path: '/withdrawal-request',
    route: WithdrawalRequestRoutes,
  },
  {
    path: '/uploadImg',
    route: fileUploadRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
