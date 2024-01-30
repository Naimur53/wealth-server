import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', auth(UserRole.admin), UserController.getAllUser);
router.get(
  '/admin/overview',
  auth(UserRole.admin),
  UserController.adminOverview
);
router.get(
  '/seller/overview',
  auth(UserRole.seller),
  UserController.sellerOverview
);
router.get('/user/overview', auth(UserRole.user), UserController.userOverview);
router.post('/nowpayments-ipn', UserController.sellerIpn);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  UserController.getSingleUser
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.user, UserRole.seller),
  validateRequest(UserValidation.updateValidation),
  UserController.updateUser
);
router.delete('/:id', auth(UserRole.admin), UserController.deleteUser);

export const UserRoutes = router;
