import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    groupId: z.string({ required_error: 'groupId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    groupId: z.string({ required_error: 'groupId is required' }),
  }),
});
export const SeenMessageValidation = {
  createValidation,
  updateValidation,
};
