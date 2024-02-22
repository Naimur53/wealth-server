import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { PropertryOrdersController } from './propertryOrders.controller';
        import { PropertryOrdersValidation } from './propertryOrders.validation';
        const router = express.Router();
        
        router.get('/', PropertryOrdersController.getAllPropertryOrders);
        router.get('/:id', PropertryOrdersController.getSinglePropertryOrders);
        
        router.post(
          '/',
          validateRequest(PropertryOrdersValidation.createValidation),
          PropertryOrdersController.createPropertryOrders
        );
        
        router.patch(
          '/:id',
          validateRequest(PropertryOrdersValidation.updateValidation),
          PropertryOrdersController.updatePropertryOrders
        );
        router.delete('/:id', PropertryOrdersController.deletePropertryOrders);
        
        export const PropertryOrdersRoutes = router;