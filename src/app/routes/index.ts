import { AccountRoutes } from '../modules/account/account.router';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CartRoutes } from '../modules/cart/cart.router';
import { OrdersRoutes } from '../modules/orders/orders.router';

import express from 'express';
import { ProfileRoutes } from '../modules/profile/profile.router';
import { UserRoutes } from '../modules/user/user.router';
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
    path: '/orders',
    route: OrdersRoutes,
  },

  {
    path: '/cart',
    route: CartRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
