import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SavedPropertryController } from './savedPropertry.controller';
import { SavedPropertryValidation } from './savedPropertry.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedPropertryController.getAllSavedPropertry
);
router.get(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedPropertryController.getSingleSavedPropertry
);

router.post(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  validateRequest(SavedPropertryValidation.createValidation),
  SavedPropertryController.createSavedPropertry
);

// router.patch(
//   '/:id',
//   validateRequest(SavedPropertryValidation.updateValidation),
//   SavedPropertryController.updateSavedPropertry
// );
router.delete(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedPropertryController.deleteSavedPropertry
);

export const SavedPropertryRoutes = router;
