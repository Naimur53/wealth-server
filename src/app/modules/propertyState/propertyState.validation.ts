import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    propertyId: z.string({ required_error: 'propertyId is required' }),
    time: z.string({ required_error: 'time is required' }),
    price: z.number({ required_error: 'price is required' }),
  }),
});

const updateValidation = z.object({
  body: z.object({
    time: z.date({ required_error: 'time is required' }).optional(),
    price: z.number({ required_error: 'price is required' }).optional(),
  }),
});
export const PropertyStateValidation = {
  createValidation,
  updateValidation,
};
