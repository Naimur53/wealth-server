import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FeedbackController } from './feedback.controller';
import { FeedbackValidation } from './feedback.validation';
const router = express.Router();

router.get('/', FeedbackController.getAllFeedback);
router.get('/:id', FeedbackController.getSingleFeedback);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  validateRequest(FeedbackValidation.createValidation),
  FeedbackController.createFeedback
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user),
  validateRequest(FeedbackValidation.updateValidation),
  FeedbackController.updateFeedback
);
router.delete('/:id', FeedbackController.deleteFeedback);

export const FeedbackRoutes = router;
