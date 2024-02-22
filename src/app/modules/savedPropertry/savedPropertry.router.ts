import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SavedPropertryController } from './savedPropertry.controller';
        import { SavedPropertryValidation } from './savedPropertry.validation';
        const router = express.Router();
        
        router.get('/', SavedPropertryController.getAllSavedPropertry);
        router.get('/:id', SavedPropertryController.getSingleSavedPropertry);
        
        router.post(
          '/',
          validateRequest(SavedPropertryValidation.createValidation),
          SavedPropertryController.createSavedPropertry
        );
        
        router.patch(
          '/:id',
          validateRequest(SavedPropertryValidation.updateValidation),
          SavedPropertryController.updateSavedPropertry
        );
        router.delete('/:id', SavedPropertryController.deleteSavedPropertry);
        
        export const SavedPropertryRoutes = router;