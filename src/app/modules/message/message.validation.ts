import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    chatGroupId: z.string({ required_error: 'chatGroupId is required' }),
    text: z.string({ required_error: 'text is required' }).optional(),
    image: z.string({ required_error: 'image is required' }).optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const MessageValidation = {
  createValidation,
  updateValidation,
};
