"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }),
        title: zod_1.z.string({ required_error: 'title is required' }),
        description: zod_1.z.string({ required_error: 'title is required' }),
        date: zod_1.z.string({ required_error: 'title is required' }),
        location: zod_1.z.string({ required_error: 'location is required' }),
        streetLocation: zod_1.z.string({ required_error: 'street location is required' }),
    }),
});
const addInterestValidation = zod_1.z.object({
    body: zod_1.z.object({
        promotionId: zod_1.z.string({ required_error: 'propertyId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }).optional(),
        title: zod_1.z.string({ required_error: 'title is required' }).optional(),
        description: zod_1.z.string({ required_error: 'title is required' }).optional(),
        date: zod_1.z.string({ required_error: 'title is required' }).optional(),
        location: zod_1.z.string({ required_error: 'location is required' }).optional(),
        streetLocation: zod_1.z
            .string({ required_error: 'street location is required' })
            .optional(),
    }),
});
exports.PromotionValidation = {
    createValidation,
    updateValidation,
    addInterestValidation,
};
