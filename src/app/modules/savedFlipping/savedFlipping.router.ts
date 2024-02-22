import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SavedFlippingController } from './savedFlipping.controller';
        import { SavedFlippingValidation } from './savedFlipping.validation';
        const router = express.Router();
        
        router.get('/', SavedFlippingController.getAllSavedFlipping);
        router.get('/:id', SavedFlippingController.getSingleSavedFlipping);
        
        router.post(
          '/',
          validateRequest(SavedFlippingValidation.createValidation),
          SavedFlippingController.createSavedFlipping
        );
        
        router.patch(
          '/:id',
          validateRequest(SavedFlippingValidation.updateValidation),
          SavedFlippingController.updateSavedFlipping
        );
        router.delete('/:id', SavedFlippingController.deleteSavedFlipping);
        
        export const SavedFlippingRoutes = router;