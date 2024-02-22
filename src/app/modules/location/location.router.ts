import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { LocationController } from './location.controller';
import { LocationValidation } from './location.validation';
const router = express.Router();

router.get('/', LocationController.getAllLocation);
router.get(
  '/:id',
  validateRequest(LocationValidation.getSingleLocation),
  LocationController.getSingleLocation
);

router.post(
  '/',
  validateRequest(LocationValidation.createValidation),
  LocationController.createLocation
);

router.patch(
  '/:id',
  validateRequest(LocationValidation.updateValidation),
  LocationController.updateLocation
);
router.delete('/:id', LocationController.deleteLocation);

export const LocationRoutes = router;
