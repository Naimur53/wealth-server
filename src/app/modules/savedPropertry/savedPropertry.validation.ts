import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    propertyId: z.string({ required_error: 'propertyId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const SavedPropertryValidation = {
  createValidation,
  updateValidation,
};
