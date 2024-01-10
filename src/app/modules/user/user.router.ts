import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get(
  '/',
  // auth(UserRole.admin, UserRole.seller),
  UserController.getAllUser
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.seller),
  UserController.getSingleUser
);

router.patch(
  '/:id',
  // auth(UserRole.admin, UserRole.user, UserRole.seller),
  validateRequest(UserValidation.updateValidation),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);

export const UserRoutes = router;
