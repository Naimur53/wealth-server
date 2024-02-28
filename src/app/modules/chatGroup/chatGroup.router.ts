import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ChatGroupController } from './chatGroup.controller';
import { ChatGroupValidation } from './chatGroup.validation';
const router = express.Router();

router.get('/', ChatGroupController.getAllChatGroup);
router.get('/:id', ChatGroupController.getSingleChatGroup);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(ChatGroupValidation.createValidation),
  ChatGroupController.createChatGroup
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(ChatGroupValidation.updateValidation),
  ChatGroupController.updateChatGroup
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  ChatGroupController.deleteChatGroup
);

export const ChatGroupRoutes = router;
