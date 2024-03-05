import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    chatGroupId: z.string({ required_error: 'chatGroupId is required' }),
    text: z
      .string({ required_error: 'text is required' })
      .optional()
      .nullable(),
    image: z
      .string({ required_error: 'image is required' })
      .optional()
      .nullable(),
    replyId: z
      .string({ required_error: 'image is required' })
      .optional()
      .nullable(),
    sendBy: z
      .object({
        email: z.string(),
        id: z.string(),
        name: z.string(),
        role: z.string(),
        isChampion: z.string(),
        profileImg: z.string(),
      })
      .optional()
      .nullable(),
    reply: z
      .object({
        chatGroupId: z.string({ required_error: 'chatGroupId is required' }),
        text: z
          .string({ required_error: 'text is required' })
          .optional()
          .nullable(),
        image: z
          .string({ required_error: 'image is required' })
          .optional()
          .nullable(),
        replyId: z
          .string({ required_error: 'image is required' })
          .optional()
          .nullable(),
        sendBy: z
          .object({
            email: z.string(),
            id: z.string(),
            name: z.string(),
            role: z.string(),
            isChampion: z.string(),
            profileImg: z.string(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const MessageValidation = {
  createValidation,
  updateValidation,
};
