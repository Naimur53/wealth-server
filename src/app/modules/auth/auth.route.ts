import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();
router.post(
  '/signup',
  validateRequest(AuthValidation.createAuthZodSchema),
  AuthController.createUser
);
router.post(
  '/signin',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);
router.post('/verify-signup-token/:token', AuthController.verifySignupToken);

export const AuthRoutes = router;
