import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PropertyOrdersController } from './propertyOrders.controller';
import { PropertyOrdersValidation } from './propertyOrders.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  PropertyOrdersController.getAllPropertyOrders
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.superAdmin),
  PropertyOrdersController.getSinglePropertyOrders
);

router.post(
  '/',
  auth(UserRole.user),
  validateRequest(PropertyOrdersValidation.createValidation),
  PropertyOrdersController.createPropertyOrders
);

router.patch(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  validateRequest(PropertyOrdersValidation.updateValidation),
  PropertyOrdersController.updatePropertyOrders
);
router.delete('/:id', PropertyOrdersController.deletePropertyOrders);

export const PropertyOrdersRoutes = router;
