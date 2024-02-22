import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { FlippingOrdersController } from './flippingOrders.controller';
        import { FlippingOrdersValidation } from './flippingOrders.validation';
        const router = express.Router();
        
        router.get('/', FlippingOrdersController.getAllFlippingOrders);
        router.get('/:id', FlippingOrdersController.getSingleFlippingOrders);
        
        router.post(
          '/',
          validateRequest(FlippingOrdersValidation.createValidation),
          FlippingOrdersController.createFlippingOrders
        );
        
        router.patch(
          '/:id',
          validateRequest(FlippingOrdersValidation.updateValidation),
          FlippingOrdersController.updateFlippingOrders
        );
        router.delete('/:id', FlippingOrdersController.deleteFlippingOrders);
        
        export const FlippingOrdersRoutes = router;