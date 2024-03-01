import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';
const router = express.Router();

router.get('/', FaqController.getAllFaq);
router.get('/:id', FaqController.getSingleFaq);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(FaqValidation.createValidation),
  FaqController.createFaq
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(FaqValidation.updateValidation),
  FaqController.updateFaq
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  FaqController.deleteFaq
);

export const FaqRoutes = router;
