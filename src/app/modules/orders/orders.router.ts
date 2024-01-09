import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersController } from './orders.controller';
import { OrdersValidation } from './orders.validation';
const router = express.Router();

router.get('/', OrdersController.getAllOrders);
router.get('/:id', OrdersController.getSingleOrders);

router.post(
  '/',
  validateRequest(OrdersValidation.createValidation),
  OrdersController.createOrders
);

router.patch(
  '/:id',
  validateRequest(OrdersValidation.updateValidation),
  OrdersController.updateOrders
);
router.delete('/:id', OrdersController.deleteOrders);

export const OrdersRoutes = router;
