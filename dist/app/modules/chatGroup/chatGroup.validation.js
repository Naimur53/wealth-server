"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGroupValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is require' }),
        name: zod_1.z.string({ required_error: 'name is require' }),
        type: zod_1.z.enum(Object.keys(client_1.EChatGroupType)),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is require' }).optional(),
        name: zod_1.z.string({ required_error: 'name is require' }).optional(),
        type: zod_1.z
            .enum(Object.keys(client_1.EChatGroupType))
            .optional(),
    }),
});
exports.ChatGroupValidation = {
    createValidation,
    updateValidation,
};
