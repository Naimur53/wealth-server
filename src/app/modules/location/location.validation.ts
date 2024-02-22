import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Location name is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Location name is required' }),
  }),
});
export const LocationValidation = {
  createValidation,
  updateValidation,
};
