"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z.string({ required_error: 'email is required' }).email(),
        contactNo: zod_1.z.string({ required_error: 'contactNo is required' }),
        address: zod_1.z.string({ required_error: 'address is required' }),
        profileImg: zod_1.z.string({ required_error: 'profileImg is required' }),
        password: zod_1.z.string({ required_error: 'password is required' }),
        role: zod_1.z
            .enum([...Object.values(client_1.UserRole)], {})
            .optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }).optional(),
        email: zod_1.z.string({ required_error: 'email is required' }).optional(),
        contactNo: zod_1.z.string({ required_error: 'contactNo is required' }).optional(),
        address: zod_1.z.string({ required_error: 'address is required' }).optional(),
        profileImg: zod_1.z
            .string({ required_error: 'profileImg is required' })
            .optional(),
        password: zod_1.z.string({ required_error: 'password is required' }).optional(),
        role: zod_1.z
            .enum([...Object.values(client_1.UserRole)], {})
            .optional(),
    }),
});
exports.UserValidation = {
    createValidation,
    updateValidation,
};
