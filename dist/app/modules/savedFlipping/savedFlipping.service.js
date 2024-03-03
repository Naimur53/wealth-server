"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedFlippingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllSavedFlipping = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const output = yield prisma_1.default.savedFlipping.findMany({
        where: { ownById: userId },
        include: {
            flipping: true,
        },
    });
    return output;
});
const createSavedFlipping = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isFlippingExits = yield prisma_1.default.flipping.findUnique({
        where: { id: payload.flippingId },
    });
    if (!isFlippingExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'flipping is not exits');
    }
    // check already saved ?
    const isAlreadyExist = yield prisma_1.default.savedFlipping.findFirst({
        where: {
            ownById: payload.ownById,
            flippingId: payload.flippingId,
        },
    });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already saved');
    }
    const newSavedFlipping = yield prisma_1.default.savedFlipping.create({
        data: payload,
    });
    return newSavedFlipping;
});
const getSingleSavedFlipping = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedFlipping.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSavedFlipping = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedFlipping.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSavedFlipping = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedFlipping.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SavedFlipping not found!');
    }
    return result;
});
exports.SavedFlippingService = {
    getAllSavedFlipping,
    createSavedFlipping,
    updateSavedFlipping,
    getSingleSavedFlipping,
    deleteSavedFlipping,
};
