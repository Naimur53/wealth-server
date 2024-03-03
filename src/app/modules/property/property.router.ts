import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PropertyController } from './property.controller';
import { PropertyValidation } from './property.validation';
const router = express.Router();

router.get('/', PropertyController.getAllProperty);
router.get('/:id', PropertyController.getSingleProperty);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PropertyValidation.createValidation),
  PropertyController.createProperty
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PropertyValidation.updateValidation),
  PropertyController.updateProperty
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  PropertyController.deleteProperty
);

export const PropertyRoutes = router;
