import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { FaqController } from './faq.controller';
        import { FaqValidation } from './faq.validation';
        const router = express.Router();
        
        router.get('/', FaqController.getAllFaq);
        router.get('/:id', FaqController.getSingleFaq);
        
        router.post(
          '/',
          validateRequest(FaqValidation.createValidation),
          FaqController.createFaq
        );
        
        router.patch(
          '/:id',
          validateRequest(FaqValidation.updateValidation),
          FaqController.updateFaq
        );
        router.delete('/:id', FaqController.deleteFaq);
        
        export const FaqRoutes = router;