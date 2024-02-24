import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Location name is required' }),
    imgUrl: z.string({ required_error: 'ImgUrl name is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Location name is required' }),
    imgUrl: z.string({ required_error: 'imgUrl  is required' }).optional(),
  }),
});
const getSingleLocation = z.object({
  body: z.object({
    flipping: z.boolean().optional(),
    property: z.boolean().optional(),
    crowdFund: z.boolean().optional(),
  }),
});
export const LocationValidation = {
  createValidation,
  updateValidation,
  getSingleLocation,
};
