import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SavedFlipingController } from './savedFliping.controller';
        import { SavedFlipingValidation } from './savedFliping.validation';
        const router = express.Router();
        
        router.get('/', SavedFlipingController.getAllSavedFliping);
        router.get('/:id', SavedFlipingController.getSingleSavedFliping);
        
        router.post(
          '/',
          validateRequest(SavedFlipingValidation.createValidation),
          SavedFlipingController.createSavedFliping
        );
        
        router.patch(
          '/:id',
          validateRequest(SavedFlipingValidation.updateValidation),
          SavedFlipingController.updateSavedFliping
        );
        router.delete('/:id', SavedFlipingController.deleteSavedFliping);
        
        export const SavedFlipingRoutes = router;