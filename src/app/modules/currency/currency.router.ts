import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CurrencyController } from './currency.controller';
import { CurrencyValidation } from './currency.validation';
const router = express.Router();

router.get('/', CurrencyController.getAllCurrency);
router.get(
  '/single-user-currency',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  CurrencyController.getSingleCurrencyByUserId
);
// router.get('/:id', CurrencyController.getSingleCurrency);

router.post(
  '/',
  validateRequest(CurrencyValidation.createValidation),
  CurrencyController.createCurrency
);

// router.patch(
//   '/:id',
//   validateRequest(CurrencyValidation.updateValidation),
//   CurrencyController.updateCurrency
// );
// router.delete('/:id', CurrencyController.deleteCurrency);

export const CurrencyRoutes = router;
