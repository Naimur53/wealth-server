import { EOrderPaymentType, EOrderStatus } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    flippingId: z.string({ required_error: 'flipping id is required' }),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    paymentReceiptUrl: z.string().optional(),
    paystackId: z.string().optional(),
    wealthBankId: z.string().optional(),
    orderById: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    status: z.enum(Object.keys(EOrderStatus) as [string, ...string[]]),
    paymentType: z.enum(
      Object.keys(EOrderPaymentType) as [string, ...string[]]
    ),
  }),
});
const updateValidation = z.object({
  body: z.object({
    flippingId: z
      .string({ required_error: 'flipping id is required' })
      .optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    paymentReceiptUrl: z.string().optional(),
    paystackId: z.string().optional(),
    wealthBankId: z.string().optional(),
    orderById: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    status: z
      .enum(Object.keys(EOrderStatus) as [string, ...string[]])
      .optional(),
    paymentType: z
      .enum(Object.keys(EOrderPaymentType) as [string, ...string[]])
      .optional(),
  }),
});
export const FlippingOrdersValidation = {
  createValidation,
  updateValidation,
};
