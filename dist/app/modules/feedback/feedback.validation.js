"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number({ required_error: 'rating is required' }),
        description: zod_1.z.string({ required_error: 'description is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number({ required_error: 'rating is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'description is required' })
            .optional(),
    }),
});
exports.FeedbackValidation = {
    createValidation,
    updateValidation,
};
