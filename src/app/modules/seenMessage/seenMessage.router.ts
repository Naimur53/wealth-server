import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { SeenMessageController } from './seenMessage.controller';
        import { SeenMessageValidation } from './seenMessage.validation';
        const router = express.Router();
        
        router.get('/', SeenMessageController.getAllSeenMessage);
        router.get('/:id', SeenMessageController.getSingleSeenMessage);
        
        router.post(
          '/',
          validateRequest(SeenMessageValidation.createValidation),
          SeenMessageController.createSeenMessage
        );
        
        router.patch(
          '/:id',
          validateRequest(SeenMessageValidation.updateValidation),
          SeenMessageController.updateSeenMessage
        );
        router.delete('/:id', SeenMessageController.deleteSeenMessage);
        
        export const SeenMessageRoutes = router;