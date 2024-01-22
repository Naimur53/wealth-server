import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';
const router = express.Router();

router.get('/', auth(UserRole.admin), CartController.getAllCart);
router.get(
  '/my-carts',
  auth(UserRole.admin, UserRole.user, UserRole.seller),
  CartController.getSingleUserCarts
);
router.get('/:id', auth(UserRole.admin), CartController.getSingleCart);

router.post(
  '/',
  auth(UserRole.admin, UserRole.user, UserRole.seller),
  validateRequest(CartValidation.createValidation),
  CartController.createCart
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.user, UserRole.seller),
  validateRequest(CartValidation.updateValidation),
  CartController.updateCart
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.user, UserRole.seller),
  CartController.deleteCart
);

export const CartRoutes = router;
