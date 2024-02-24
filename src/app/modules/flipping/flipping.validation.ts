import { EPropertyStatus, EPropertyType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is required' }),
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'description is required' }),
    rooms: z.number().optional(),
    size: z.string({ required_error: 'size is required' }),
    floor: z.string().optional(),
    status: z
      .enum(Object.keys(EPropertyStatus) as [string, ...string[]])
      .optional(),
    price: z.number({ required_error: 'price is required' }),
    streetLocation: z.string({ required_error: 'streetLocation is required' }),
    videoUrl: z.string({ required_error: 'videoUrl is required' }),
    images: z.array(z.string()),
    locationId: z.string({ required_error: 'locationId is required' }),
    type: z.enum(Object.keys(EPropertyType) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const FlippingValidation = {
  createValidation,
  updateValidation,
};
