import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    amount: z.number().default(0),
    ownById: z.string({ required_error: 'ownById is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const CurrencyValidation = {
  createValidation,
  updateValidation,
};
