import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    crowdFundId: z.string({ required_error: 'crowdFundId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const SavedCrowdFundValidation = {
  createValidation,
  updateValidation,
};
