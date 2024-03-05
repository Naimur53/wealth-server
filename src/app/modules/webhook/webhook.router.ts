import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from '../user/user.controller';
import { webHookController } from './webhook.controller';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  UserController.getAllUser
);

router.post(
  '/ai-support',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.superAdmin),
  webHookController.aiSupport
);
export const WebHookRoutes = router;
