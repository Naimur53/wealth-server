import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SavedCrowdFundController } from './savedCrowdFund.controller';
import { SavedCrowdFundValidation } from './savedCrowdFund.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedCrowdFundController.getAllSavedCrowdFund
);
router.get(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedCrowdFundController.getSingleSavedCrowdFund
);

router.post(
  '/',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  validateRequest(SavedCrowdFundValidation.createValidation),
  SavedCrowdFundController.createSavedCrowdFund
);

// router.patch(
//   '/:id',
//   auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
//   validateRequest(SavedCrowdFundValidation.updateValidation),
//   SavedCrowdFundController.updateSavedCrowdFund
// );
router.delete(
  '/:id',
  auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
  SavedCrowdFundController.deleteSavedCrowdFund
);

export const SavedCrowdFundRoutes = router;
