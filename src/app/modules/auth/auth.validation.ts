import { UserRole } from '@prisma/client';
import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8),
    name: z.string({ required_error: 'Name is required' }),
    role: z.nativeEnum(UserRole).default(UserRole.user).optional(),
    paymentWithPaystack: z.boolean().default(false).optional(),
    txId: z.string({ required_error: 'Name is required' }).optional(),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
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

export const AuthValidation = {
  createAuthZodSchema,
  refreshTokenZodSchema,
  loginZodSchema,
};
