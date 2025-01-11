import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PromotionController } from './promotion.controller';
import { PromotionValidation } from './promotion.validation';
const router = express.Router();

router.get('/', PromotionController.getAllPromotion);
router.get('/:id', PromotionController.getSinglePromotion);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PromotionValidation.createValidation),
  PromotionController.createPromotion
);
router.post(
  '/add-interest',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  validateRequest(PromotionValidation.addInterestValidation),
  PromotionController.addInterestInPromotion
);
router.post(
  '/remove-interest',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  validateRequest(PromotionValidation.addInterestValidation),
  PromotionController.removeInterestInPromotion
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(PromotionValidation.updateValidation),
  PromotionController.updatePromotion
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  PromotionController.deletePromotion
);

export const PromotionRoutes = router;
