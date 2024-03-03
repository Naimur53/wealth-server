"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string({ required_error: 'propertyId is required' }),
        amount: zod_1.z.number().optional(),
        bankName: zod_1.z.string().optional(),
        bankAccountNumber: zod_1.z.string().optional(),
        paymentReceiptUrl: zod_1.z.string().optional(),
        wealthBankId: zod_1.z.string().optional(),
        paymentType: zod_1.z.enum(Object.keys(client_1.EOrderPaymentType)),
        refName: zod_1.z.enum(Object.keys(client_1.EOrderRefName)),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z
            .string({ required_error: 'propertyId is required' })
            .optional(),
        bankName: zod_1.z.string().optional(),
        bankAccountNumber: zod_1.z.string().optional(),
        paymentReceiptUrl: zod_1.z.string().optional(),
        paystackId: zod_1.z.string().optional(),
        wealthBankId: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(Object.keys(client_1.EOrderStatus))
            .optional(),
        paymentType: zod_1.z
            .enum(Object.keys(client_1.EOrderPaymentType))
            .optional(),
    }),
});
exports.OrdersValidation = {
    createValidation,
    updateValidation,
};
