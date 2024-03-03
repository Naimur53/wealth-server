"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrowdFundValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }),
        title: zod_1.z.string({ required_error: 'title is required' }),
        description: zod_1.z.string({ required_error: 'description is required' }),
        rooms: zod_1.z.number().optional(),
        size: zod_1.z.string({ required_error: 'size is required' }),
        status: zod_1.z
            .enum(Object.keys(client_1.EPropertyStatus))
            .optional(),
        floor: zod_1.z.string().optional(),
        targetFund: zod_1.z.number({ required_error: 'target fund is required' }),
        fundRaised: zod_1.z
            .number({ required_error: 'fundRaised is required' })
            .optional(),
        streetLocation: zod_1.z.string({ required_error: 'streetLocation is required' }),
        videoUrl: zod_1.z.string({ required_error: 'videoUrl is required' }),
        images: zod_1.z.array(zod_1.z.string()),
        locationId: zod_1.z.string({ required_error: 'locationId is required' }),
        type: zod_1.z.enum(Object.keys(client_1.EPropertyType)),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        thumbnail: zod_1.z.string({ required_error: 'thumbnail is required' }).optional(),
        title: zod_1.z.string({ required_error: 'title is required' }).optional(),
        description: zod_1.z
            .string({ required_error: 'description is required' })
            .optional(),
        rooms: zod_1.z.number().optional(),
        size: zod_1.z.string({ required_error: 'size is required' }).optional(),
        floor: zod_1.z.string().optional(),
        targetFund: zod_1.z
            .number({ required_error: 'target fund is required' })
            .optional(),
        fundRaised: zod_1.z
            .number({ required_error: 'fundRaised is required' })
            .optional(),
        streetLocation: zod_1.z
            .string({ required_error: 'streetLocation is required' })
            .optional(),
        videoUrl: zod_1.z.string({ required_error: 'videoUrl is required' }).optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        locationId: zod_1.z
            .string({ required_error: 'locationId is required' })
            .optional(),
        type: zod_1.z
            .enum(Object.keys(client_1.EPropertyType))
            .optional(),
    }),
});
exports.CrowdFundValidation = {
    createValidation,
    updateValidation,
};
