import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CrowdFundController } from './crowdFund.controller';
import { CrowdFundValidation } from './crowdFund.validation';
const router = express.Router();

router.get('/', CrowdFundController.getAllCrowdFund);
router.get('/:id', CrowdFundController.getSingleCrowdFund);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(CrowdFundValidation.createValidation),
  CrowdFundController.createCrowdFund
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(CrowdFundValidation.updateValidation),
  CrowdFundController.updateCrowdFund
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  CrowdFundController.deleteCrowdFund
);

export const CrowdFundRoutes = router;
