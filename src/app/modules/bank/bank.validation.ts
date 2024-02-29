import { EBankType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    accountName: z.string({ required_error: 'accountName is required' }),
    accountNumber: z.string({ required_error: 'accountNumber is required' }),
    logoOfBank: z.string({ required_error: 'logoOfBank is required' }),
    typeOfBank: z.enum(Object.keys(EBankType) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).optional(),
    accountName: z
      .string({ required_error: 'accountName is required' })
      .optional(),
    accountNumber: z
      .string({ required_error: 'accountNumber is required' })
      .optional(),
    logoOfBank: z
      .string({ required_error: 'logoOfBank is required' })
      .optional(),
    typeOfBank: z
      .enum(Object.keys(EBankType) as [string, ...string[]])
      .optional(),
  }),
});
export const BankValidation = {
  createValidation,
  updateValidation,
};
