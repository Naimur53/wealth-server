"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAuthZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number is required' }),
        role: zod_1.z.nativeEnum(client_1.UserRole).default(client_1.UserRole.user).optional(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required!' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
const verifyToken = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
    }),
});
const verifyForgotToken = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
    }),
});
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number({ required_error: 'Token is required' }),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters long' }),
    }),
});
exports.AuthValidation = {
    createAuthZodSchema,
    refreshTokenZodSchema,
    loginZodSchema,
    verifyToken,
    changePassword,
    verifyForgotToken,
};
