"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Location name is required' }),
        imgUrl: zod_1.z.string({ required_error: 'ImgUrl name is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Location name is required' }),
        imgUrl: zod_1.z.string({ required_error: 'imgUrl  is required' }).optional(),
    }),
});
const getSingleLocation = zod_1.z.object({
    body: zod_1.z.object({
        property: zod_1.z.boolean().optional(),
        crowdFund: zod_1.z.boolean().optional(),
    }),
});
exports.LocationValidation = {
    createValidation,
    updateValidation,
    getSingleLocation,
};
