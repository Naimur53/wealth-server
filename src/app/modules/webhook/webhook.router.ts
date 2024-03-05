import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { webHookController } from './webhook.controller';

const router = express.Router();

router.post('/', webHookController.paystack);

router.post(
  '/ai-support',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.superAdmin),
  webHookController.aiSupport
);
export const WebHookRoutes = router;
