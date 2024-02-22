import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { PropertyController } from './property.controller';
        import { PropertyValidation } from './property.validation';
        const router = express.Router();
        
        router.get('/', PropertyController.getAllProperty);
        router.get('/:id', PropertyController.getSingleProperty);
        
        router.post(
          '/',
          validateRequest(PropertyValidation.createValidation),
          PropertyController.createProperty
        );
        
        router.patch(
          '/:id',
          validateRequest(PropertyValidation.updateValidation),
          PropertyController.updateProperty
        );
        router.delete('/:id', PropertyController.deleteProperty);
        
        export const PropertyRoutes = router;