import { EPropertyType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is required' }),
    title: z.string({ required_error: 'title is required' }),
    description: z.string({ required_error: 'description is required' }),
    rooms: z.number().optional(),
    size: z.string({ required_error: 'size is required' }),
    floor: z.string().optional(),
    targetFund: z.number({ required_error: 'target fund is required' }),
    fundRaised: z
      .number({ required_error: 'fundRaised is required' })
      .optional(),
    streetLocation: z.string({ required_error: 'streetLocation is required' }),
    videoUrl: z.string({ required_error: 'videoUrl is required' }),
    images: z.array(z.string()),
    locationId: z.string({ required_error: 'locationId is required' }),
    type: z.enum(Object.keys(EPropertyType) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({
    thumbnail: z.string({ required_error: 'thumbnail is required' }).optional(),
    title: z.string({ required_error: 'title is required' }).optional(),
    description: z
      .string({ required_error: 'description is required' })
      .optional(),
    rooms: z.number().optional(),
    size: z.string({ required_error: 'size is required' }).optional(),
    floor: z.string().optional(),
    targetFund: z
      .number({ required_error: 'target fund is required' })
      .optional(),
    fundRaised: z
      .number({ required_error: 'fundRaised is required' })
      .optional(),
    streetLocation: z
      .string({ required_error: 'streetLocation is required' })
      .optional(),
    videoUrl: z.string({ required_error: 'videoUrl is required' }).optional(),
    images: z.array(z.string()).optional(),
    locationId: z
      .string({ required_error: 'locationId is required' })
      .optional(),
    type: z
      .enum(Object.keys(EPropertyType) as [string, ...string[]])
      .optional(),
  }),
});
export const CrowdFundValidation = {
  createValidation,
  updateValidation,
};
