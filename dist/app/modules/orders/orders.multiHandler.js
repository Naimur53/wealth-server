"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
function findUniqueEntity(refName, ids) {
    // const id = as string
    if (refName === 'crowdFund') {
        return prisma_1.default.crowdFund.findUnique({ where: { id: ids[`${refName}Id`] } });
    }
    else if (refName === 'flipping') {
        return prisma_1.default.flipping.findUnique({ where: { id: ids[`${refName}Id`] } });
    }
    else if (refName === 'property') {
        return prisma_1.default.property.findUnique({ where: { id: ids[`${refName}Id`] } });
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid refName');
    }
}
exports.multiHandler = { findUniqueEntity };
