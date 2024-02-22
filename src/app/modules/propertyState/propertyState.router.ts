import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { PropertyStateController } from './propertyState.controller';
        import { PropertyStateValidation } from './propertyState.validation';
        const router = express.Router();
        
        router.get('/', PropertyStateController.getAllPropertyState);
        router.get('/:id', PropertyStateController.getSinglePropertyState);
        
        router.post(
          '/',
          validateRequest(PropertyStateValidation.createValidation),
          PropertyStateController.createPropertyState
        );
        
        router.patch(
          '/:id',
          validateRequest(PropertyStateValidation.updateValidation),
          PropertyStateController.updatePropertyState
        );
        router.delete('/:id', PropertyStateController.deletePropertyState);
        
        export const PropertyStateRoutes = router;