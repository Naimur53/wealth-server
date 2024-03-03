import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from '../user/user.controller';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  UserController.getAllUser
);
