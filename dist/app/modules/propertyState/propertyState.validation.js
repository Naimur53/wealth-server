"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStateValidation = void 0;
const zod_1 = require("zod");
const propertyState_interface_1 = require("./propertyState.interface");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string({ required_error: 'propertyId is required' }),
        time: zod_1.z.string({ required_error: 'time is required' }),
        price: zod_1.z.number({ required_error: 'price is required' }),
    }),
});
const createMultiValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        propertyId: zod_1.z.string({ required_error: 'propertyId is required' }),
        time: zod_1.z.string({ required_error: 'time is required' }),
        price: zod_1.z.number({ required_error: 'price is required' }),
    })),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        time: zod_1.z.date({ required_error: 'time is required' }).optional(),
        price: zod_1.z.number({ required_error: 'price is required' }).optional(),
    }),
});
const getSingleAllPropertyState = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'property is required' }),
        type: zod_1.z.enum(Object.keys(propertyState_interface_1.EPropertyStateQuery)),
    }),
});
exports.PropertyStateValidation = {
    createValidation,
    updateValidation,
    createMultiValidation,
    getSingleAllPropertyState,
};
