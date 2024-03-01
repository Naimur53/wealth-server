import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is required' }),
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'title is required' }),
    date: z.string({ required_error: 'title is required' }),
    location: z.string({ required_error: 'location is required' }),
    streetLocation: z.string({ required_error: 'street location is required' }),
  }),
});
const addInterestValidation = z.object({
  body: z.object({
    promotionId: z.string({ required_error: 'propertyId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is required' }).optional(),
    title: z.string({ required_error: 'title is required' }).optional(),
    description: z.string({ required_error: 'title is required' }).optional(),
    date: z.string({ required_error: 'title is required' }).optional(),
    location: z.string({ required_error: 'location is required' }).optional(),
    streetLocation: z
      .string({ required_error: 'street location is required' })
      .optional(),
  }),
});
export const PromotionValidation = {
  createValidation,
  updateValidation,
  addInterestValidation,
};
