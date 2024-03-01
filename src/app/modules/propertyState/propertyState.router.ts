import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PropertyStateController } from './propertyState.controller';
import { PropertyStateValidation } from './propertyState.validation';
const router = express.Router();

router.get('/', PropertyStateController.getAllPropertyState);
router.get('/:id', PropertyStateController.getSinglePropertyState);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PropertyStateValidation.createValidation),
  PropertyStateController.createPropertyState
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PropertyStateValidation.updateValidation),
  PropertyStateController.updatePropertyState
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  PropertyStateController.deletePropertyState
);

export const PropertyStateRoutes = router;
