import { UserRole } from '@prisma/client';
import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8),
    name: z.string({ required_error: 'Name is required' }),
    phoneNumber: z.string({ required_error: 'Phone Number is required' }),
    role: z.nativeEnum(UserRole).default(UserRole.user).optional(),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});
const verifyToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
  }),
});
const verifyForgotToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
    email: z.string({ required_error: 'Email is required' }),
  }),
});
const changePassword = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
  }),
});

export const AuthValidation = {
  createAuthZodSchema,
  refreshTokenZodSchema,
  loginZodSchema,
  verifyToken,
  changePassword,
  verifyForgotToken,
};
