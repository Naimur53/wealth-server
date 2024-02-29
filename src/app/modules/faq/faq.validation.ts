import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    question: z.string({ required_error: 'question is required' }),
    ans: z.string({ required_error: 'ans is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    question: z.string({ required_error: 'question is required' }).optional(),
    ans: z.string({ required_error: 'ans is required' }).optional(),
  }),
});
export const FaqValidation = {
  createValidation,
  updateValidation,
};
