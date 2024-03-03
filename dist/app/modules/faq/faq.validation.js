"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string({ required_error: 'question is required' }),
        ans: zod_1.z.string({ required_error: 'ans is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string({ required_error: 'question is required' }).optional(),
        ans: zod_1.z.string({ required_error: 'ans is required' }).optional(),
    }),
});
exports.FaqValidation = {
    createValidation,
    updateValidation,
};
