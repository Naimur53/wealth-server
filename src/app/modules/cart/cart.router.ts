import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';
const router = express.Router();

router.get('/', CartController.getAllCart);
router.get('/:id', CartController.getSingleCart);

router.post(
  '/',
  validateRequest(CartValidation.createValidation),
  CartController.createCart
);

router.patch(
  '/:id',
  validateRequest(CartValidation.updateValidation),
  CartController.updateCart
);
router.delete('/:id', CartController.deleteCart);

export const CartRoutes = router;
