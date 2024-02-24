import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CrowdFundController } from './crowdFund.controller';
import { CrowdFundValidation } from './crowdFund.validation';
const router = express.Router();

router.get('/', CrowdFundController.getAllCrowdFund);
router.get('/:id', CrowdFundController.getSingleCrowdFund);

router.post(
  '/',
  validateRequest(CrowdFundValidation.createValidation),
  CrowdFundController.createCrowdFund
);

router.patch(
  '/:id',
  validateRequest(CrowdFundValidation.updateValidation),
  CrowdFundController.updateCrowdFund
);
router.delete('/:id', CrowdFundController.deleteCrowdFund);

export const CrowdFundRoutes = router;
