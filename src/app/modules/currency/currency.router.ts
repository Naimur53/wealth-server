import express from 'express';
import { CurrencyController } from './currency.controller';
const router = express.Router();

router.get('/', CurrencyController.getAllCurrency);
// router.get('/:id', CurrencyController.getSingleCurrency);

// router.post(
//   '/',
//   validateRequest(CurrencyValidation.createValidation),
//   CurrencyController.createCurrency
// );

// router.patch(
//   '/:id',
//   validateRequest(CurrencyValidation.updateValidation),
//   CurrencyController.updateCurrency
// );
// router.delete('/:id', CurrencyController.deleteCurrency);

export const CurrencyRoutes = router;
