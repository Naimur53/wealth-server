import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { FlipingController } from './fliping.controller';
        import { FlipingValidation } from './fliping.validation';
        const router = express.Router();
        
        router.get('/', FlipingController.getAllFliping);
        router.get('/:id', FlipingController.getSingleFliping);
        
        router.post(
          '/',
          validateRequest(FlipingValidation.createValidation),
          FlipingController.createFliping
        );
        
        router.patch(
          '/:id',
          validateRequest(FlipingValidation.updateValidation),
          FlipingController.updateFliping
        );
        router.delete('/:id', FlipingController.deleteFliping);
        
        export const FlipingRoutes = router;