import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersController } from './Orders.controller';
import { OrdersValidation } from './orders.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  OrdersController.getAllOrders
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  OrdersController.getSingleOrders
);

router.post(
  '/',
  auth(UserRole.user),
  validateRequest(OrdersValidation.createValidation),
  OrdersController.createOrders
);

router.patch(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  validateRequest(OrdersValidation.updateValidation),
  OrdersController.updateOrders
);
router.delete('/:id', OrdersController.deleteOrders);

export const OrdersRoutes = router;
