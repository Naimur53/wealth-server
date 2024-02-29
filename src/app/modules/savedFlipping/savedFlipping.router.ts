import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SavedFlippingController } from './savedFlipping.controller';
import { SavedFlippingValidation } from './savedFlipping.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedFlippingController.getAllSavedFlipping
);
router.get(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedFlippingController.getSingleSavedFlipping
);

router.post(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  validateRequest(SavedFlippingValidation.createValidation),
  SavedFlippingController.createSavedFlipping
);

// router.patch(
//   '/:id',
//   auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
//   validateRequest(SavedFlippingValidation.updateValidation),
//   SavedFlippingController.updateSavedFlipping
// );
router.delete(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedFlippingController.deleteSavedFlipping
);

export const SavedFlippingRoutes = router;
