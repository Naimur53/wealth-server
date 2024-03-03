"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        chatGroupId: zod_1.z.string({ required_error: 'chatGroupId is required' }),
        text: zod_1.z.string({ required_error: 'text is required' }).optional(),
        image: zod_1.z.string({ required_error: 'image is required' }).optional(),
        replyId: zod_1.z.string({ required_error: 'image is required' }).optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.MessageValidation = {
    createValidation,
    updateValidation,
};
