"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStateValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string({ required_error: 'propertyId is required' }),
        time: zod_1.z.string({ required_error: 'time is required' }),
        price: zod_1.z.number({ required_error: 'price is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        time: zod_1.z.date({ required_error: 'time is required' }).optional(),
        price: zod_1.z.number({ required_error: 'price is required' }).optional(),
    }),
});
exports.PropertyStateValidation = {
    createValidation,
    updateValidation,
};
