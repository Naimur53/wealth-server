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
exports.SavedPropertryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllSavedPropertry = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const output = yield prisma_1.default.savedPropertry.findMany({
        where: { ownById: userId },
        include: {
            property: true,
        },
    });
    return output;
});
const createSavedPropertry = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isPropertyExits = yield prisma_1.default.property.findUnique({
        where: { id: payload.propertyId },
    });
    if (!isPropertyExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, ' property is not exits');
    }
    // check already saved ?
    const isAlreadyExist = yield prisma_1.default.savedPropertry.findFirst({
        where: {
            ownById: payload.ownById,
            propertyId: payload.propertyId,
        },
    });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already saved');
    }
    const newSavedPropertry = yield prisma_1.default.savedPropertry.create({
        data: payload,
    });
    return newSavedPropertry;
});
const getSingleSavedPropertry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedPropertry.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSavedPropertry = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedPropertry.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSavedPropertry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedPropertry.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SavedPropertry not found!');
    }
    return result;
});
exports.SavedPropertryService = {
    getAllSavedPropertry,
    createSavedPropertry,
    updateSavedPropertry,
    getSingleSavedPropertry,
    deleteSavedPropertry,
};
