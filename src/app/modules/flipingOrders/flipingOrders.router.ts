import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { FlipingOrdersController } from './flipingOrders.controller';
        import { FlipingOrdersValidation } from './flipingOrders.validation';
        const router = express.Router();
        
        router.get('/', FlipingOrdersController.getAllFlipingOrders);
        router.get('/:id', FlipingOrdersController.getSingleFlipingOrders);
        
        router.post(
          '/',
          validateRequest(FlipingOrdersValidation.createValidation),
          FlipingOrdersController.createFlipingOrders
        );
        
        router.patch(
          '/:id',
          validateRequest(FlipingOrdersValidation.updateValidation),
          FlipingOrdersController.updateFlipingOrders
        );
        router.delete('/:id', FlipingOrdersController.deleteFlipingOrders);
        
        export const FlipingOrdersRoutes = router;