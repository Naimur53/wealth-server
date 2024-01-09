import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AccountController } from './account.controller';
import { AccountValidation } from './account.validation';
const router = express.Router();

router.get('/', AccountController.getAllAccount);
router.get('/:id', AccountController.getSingleAccount);

router.post(
  '/',
  validateRequest(AccountValidation.createValidation),
  AccountController.createAccount
);

router.patch(
  '/:id',
  validateRequest(AccountValidation.updateValidation),
  AccountController.updateAccount
);
router.delete('/:id', AccountController.deleteAccount);

export const AccountRoutes = router;
