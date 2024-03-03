"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPropertryValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string({ required_error: 'propertyId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.SavedPropertryValidation = {
    createValidation,
    updateValidation,
};
