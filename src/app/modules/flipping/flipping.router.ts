import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FlippingController } from './flipping.controller';
import { FlippingValidation } from './flipping.validation';
const router = express.Router();

router.get('/', FlippingController.getAllFlipping);
router.get('/:id', FlippingController.getSingleFlipping);

router.post(
  '/',
  auth(UserRole.user),
  validateRequest(FlippingValidation.createValidation),
  FlippingController.createFlipping
);

router.patch(
  '/:id',
  validateRequest(FlippingValidation.updateValidation),
  FlippingController.updateFlipping
);
router.delete('/:id', FlippingController.deleteFlipping);

export const FlippingRoutes = router;
