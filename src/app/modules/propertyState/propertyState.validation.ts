import { z } from 'zod';
import { EPropertyStateQuery } from './propertyState.interface';

const createValidation = z.object({
  body: z.object({
    propertyId: z.string({ required_error: 'propertyId is required' }),
    time: z.string({ required_error: 'time is required' }),
    price: z.number({ required_error: 'price is required' }),
  }),
});
const createMultiValidation = z.object({
  body: z.array(
    z.object({
      propertyId: z.string({ required_error: 'propertyId is required' }),
      time: z.string({ required_error: 'time is required' }),
      price: z.number({ required_error: 'price is required' }),
    })
  ),
});

const updateValidation = z.object({
  body: z.object({
    time: z.date({ required_error: 'time is required' }).optional(),
    price: z.number({ required_error: 'price is required' }).optional(),
  }),
});
const getSingleAllPropertyState = z.object({
  body: z.object({
    id: z.string({ required_error: 'property is required' }),
    type: z.enum(Object.keys(EPropertyStateQuery) as [string, ...string[]]),
  }),
});
export const PropertyStateValidation = {
  createValidation,
  updateValidation,
  createMultiValidation,
  getSingleAllPropertyState,
};
