import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    rating: z.number({ required_error: 'rating is required' }),
    description: z.string({ required_error: 'description is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    rating: z.number({ required_error: 'rating is required' }).optional(),
    description: z
      .string({ required_error: 'description is required' })
      .optional(),
  }),
});
export const FeedbackValidation = {
  createValidation,
  updateValidation,
};
