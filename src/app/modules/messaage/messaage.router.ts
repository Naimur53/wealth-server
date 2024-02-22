import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { MessaageController } from './messaage.controller';
        import { MessaageValidation } from './messaage.validation';
        const router = express.Router();
        
        router.get('/', MessaageController.getAllMessaage);
        router.get('/:id', MessaageController.getSingleMessaage);
        
        router.post(
          '/',
          validateRequest(MessaageValidation.createValidation),
          MessaageController.createMessaage
        );
        
        router.patch(
          '/:id',
          validateRequest(MessaageValidation.updateValidation),
          MessaageController.updateMessaage
        );
        router.delete('/:id', MessaageController.deleteMessaage);
        
        export const MessaageRoutes = router;