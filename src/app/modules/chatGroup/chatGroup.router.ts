import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { ChatGroupController } from './chatGroup.controller';
        import { ChatGroupValidation } from './chatGroup.validation';
        const router = express.Router();
        
        router.get('/', ChatGroupController.getAllChatGroup);
        router.get('/:id', ChatGroupController.getSingleChatGroup);
        
        router.post(
          '/',
          validateRequest(ChatGroupValidation.createValidation),
          ChatGroupController.createChatGroup
        );
        
        router.patch(
          '/:id',
          validateRequest(ChatGroupValidation.updateValidation),
          ChatGroupController.updateChatGroup
        );
        router.delete('/:id', ChatGroupController.deleteChatGroup);
        
        export const ChatGroupRoutes = router;