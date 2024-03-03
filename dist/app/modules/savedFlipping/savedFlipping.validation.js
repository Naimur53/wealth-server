"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedFlippingValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        flippingId: zod_1.z.string({ required_error: 'flippingId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.SavedFlippingValidation = {
    createValidation,
    updateValidation,
};
