import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { PropertyOrdersController } from './propertyOrders.controller';
        import { PropertyOrdersValidation } from './propertyOrders.validation';
        const router = express.Router();
        
        router.get('/', PropertyOrdersController.getAllPropertyOrders);
        router.get('/:id', PropertyOrdersController.getSinglePropertyOrders);
        
        router.post(
          '/',
          validateRequest(PropertyOrdersValidation.createValidation),
          PropertyOrdersController.createPropertyOrders
        );
        
        router.patch(
          '/:id',
          validateRequest(PropertyOrdersValidation.updateValidation),
          PropertyOrdersController.updatePropertyOrders
        );
        router.delete('/:id', PropertyOrdersController.deletePropertyOrders);
        
        export const PropertyOrdersRoutes = router;