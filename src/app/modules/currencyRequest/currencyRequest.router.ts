import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CurrencyRequestController } from './currencyRequest.controller';
import { CurrencyRequestValidation } from './currencyRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  CurrencyRequestController.getAllCurrencyRequest
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  CurrencyRequestController.getSingleCurrencyRequest
);

router.post(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequest
);

router.patch(
  '/:id',
  auth(UserRole.admin),
  validateRequest(CurrencyRequestValidation.updateValidation),
  CurrencyRequestController.updateCurrencyRequest
);
router.delete('/:id', CurrencyRequestController.deleteCurrencyRequest);

export const CurrencyRequestRoutes = router;
