import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { FeedbackController } from './feedback.controller';
        import { FeedbackValidation } from './feedback.validation';
        const router = express.Router();
        
        router.get('/', FeedbackController.getAllFeedback);
        router.get('/:id', FeedbackController.getSingleFeedback);
        
        router.post(
          '/',
          validateRequest(FeedbackValidation.createValidation),
          FeedbackController.createFeedback
        );
        
        router.patch(
          '/:id',
          validateRequest(FeedbackValidation.updateValidation),
          FeedbackController.updateFeedback
        );
        router.delete('/:id', FeedbackController.deleteFeedback);
        
        export const FeedbackRoutes = router;