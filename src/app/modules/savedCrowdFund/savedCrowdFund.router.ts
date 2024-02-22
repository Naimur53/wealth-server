import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SavedCrowdFundController } from './savedCrowdFund.controller';
        import { SavedCrowdFundValidation } from './savedCrowdFund.validation';
        const router = express.Router();
        
        router.get('/', SavedCrowdFundController.getAllSavedCrowdFund);
        router.get('/:id', SavedCrowdFundController.getSingleSavedCrowdFund);
        
        router.post(
          '/',
          validateRequest(SavedCrowdFundValidation.createValidation),
          SavedCrowdFundController.createSavedCrowdFund
        );
        
        router.patch(
          '/:id',
          validateRequest(SavedCrowdFundValidation.updateValidation),
          SavedCrowdFundController.updateSavedCrowdFund
        );
        router.delete('/:id', SavedCrowdFundController.deleteSavedCrowdFund);
        
        export const SavedCrowdFundRoutes = router;