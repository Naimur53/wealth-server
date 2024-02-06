import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WithdrawalRequestController } from './withdrawalRequest.controller';
import { WithdrawalRequestValidation } from './withdrawalRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.user, UserRole.superAdmin),
  WithdrawalRequestController.getAllWithdrawalRequest
);
router.get(
  '/single-user-request',
  auth(UserRole.admin, UserRole.seller, UserRole.user, UserRole.superAdmin),
  WithdrawalRequestController.getSingleUserWithdrawalRequest
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.user, UserRole.superAdmin),
  WithdrawalRequestController.getSingleWithdrawalRequest
);

router.post(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
  validateRequest(WithdrawalRequestValidation.createValidation),
  WithdrawalRequestController.createWithdrawalRequest
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
  validateRequest(WithdrawalRequestValidation.updateValidation),
  WithdrawalRequestController.updateWithdrawalRequest
);
router.delete('/:id', WithdrawalRequestController.deleteWithdrawalRequest);

export const WithdrawalRequestRoutes = router;
