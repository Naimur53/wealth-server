import { EOrderPaymentType, EOrderRefName, EOrderStatus } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    propertyId: z
      .string({ required_error: 'propertyId is required' })
      .optional(),
    flippingId: z
      .string({ required_error: 'propertyId is required' })
      .optional(),
    crowdFundId: z
      .string({ required_error: 'propertyId is required' })
      .optional(),
    amount: z.number().optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    paymentReceiptUrl: z.string().optional(),

    wealthBankId: z.string().optional(),
    paymentType: z.enum(
      Object.keys(EOrderPaymentType) as [string, ...string[]]
    ),
    refName: z.enum(Object.keys(EOrderRefName) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({
    propertyId: z
      .string({ required_error: 'propertyId is required' })
      .optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    paymentReceiptUrl: z.string().optional(),
    paystackId: z.string().optional(),
    wealthBankId: z.string().optional(),
    status: z
      .enum(Object.keys(EOrderStatus) as [string, ...string[]])
      .optional(),
    paymentType: z
      .enum(Object.keys(EOrderPaymentType) as [string, ...string[]])
      .optional(),
  }),
});
export const OrdersValidation = {
  createValidation,
  updateValidation,
};
