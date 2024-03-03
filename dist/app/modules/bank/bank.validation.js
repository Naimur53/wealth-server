"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        accountName: zod_1.z.string({ required_error: 'accountName is required' }),
        accountNumber: zod_1.z.string({ required_error: 'accountNumber is required' }),
        logoOfBank: zod_1.z.string({ required_error: 'logoOfBank is required' }),
        typeOfBank: zod_1.z.enum(Object.keys(client_1.EBankType)),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }).optional(),
        accountName: zod_1.z
            .string({ required_error: 'accountName is required' })
            .optional(),
        accountNumber: zod_1.z
            .string({ required_error: 'accountNumber is required' })
            .optional(),
        logoOfBank: zod_1.z
            .string({ required_error: 'logoOfBank is required' })
            .optional(),
        typeOfBank: zod_1.z
            .enum(Object.keys(client_1.EBankType))
            .optional(),
    }),
});
exports.BankValidation = {
    createValidation,
    updateValidation,
};
