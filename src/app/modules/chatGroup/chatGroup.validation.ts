import { EChatGroupType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is require' }),
    name: z.string({ required_error: 'name is require' }),
    type: z.enum(Object.keys(EChatGroupType) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is require' }).optional(),
    name: z.string({ required_error: 'name is require' }).optional(),
    type: z
      .enum(Object.keys(EChatGroupType) as [string, ...string[]])
      .optional(),
  }),
});
export const ChatGroupValidation = {
  createValidation,
  updateValidation,
};
