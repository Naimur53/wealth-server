import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { CrowdFundOrdersController } from './crowdFundOrders.controller';
        import { CrowdFundOrdersValidation } from './crowdFundOrders.validation';
        const router = express.Router();
        
        router.get('/', CrowdFundOrdersController.getAllCrowdFundOrders);
        router.get('/:id', CrowdFundOrdersController.getSingleCrowdFundOrders);
        
        router.post(
          '/',
          validateRequest(CrowdFundOrdersValidation.createValidation),
          CrowdFundOrdersController.createCrowdFundOrders
        );
        
        router.patch(
          '/:id',
          validateRequest(CrowdFundOrdersValidation.updateValidation),
          CrowdFundOrdersController.updateCrowdFundOrders
        );
        router.delete('/:id', CrowdFundOrdersController.deleteCrowdFundOrders);
        
        export const CrowdFundOrdersRoutes = router;