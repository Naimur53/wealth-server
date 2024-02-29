import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    flippingId: z.string({ required_error: 'flippingId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const SavedFlippingValidation = {
  createValidation,
  updateValidation,
};
