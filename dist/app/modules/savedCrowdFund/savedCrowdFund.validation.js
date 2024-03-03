"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedCrowdFundValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        crowdFundId: zod_1.z.string({ required_error: 'crowdFundId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.SavedCrowdFundValidation = {
    createValidation,
    updateValidation,
};
