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
exports.SavedCrowdFundService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllSavedCrowdFund = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const output = yield prisma_1.default.savedCrowdFund.findMany({
        where: { ownById: userId },
        include: {
            crowdFund: true,
        },
    });
    return output;
});
const createSavedCrowdFund = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCrowdFundExits = yield prisma_1.default.crowdFund.findUnique({
        where: { id: payload.crowdFundId },
    });
    if (!isCrowdFundExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Crowd fund is not exits');
    }
    // check already saved ?
    const isAlreadyExist = yield prisma_1.default.savedCrowdFund.findFirst({
        where: {
            ownById: payload.ownById,
            crowdFundId: payload.crowdFundId,
        },
    });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already saved');
    }
    const newSavedCrowdFund = yield prisma_1.default.savedCrowdFund.create({
        data: payload,
    });
    return newSavedCrowdFund;
});
const getSingleSavedCrowdFund = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedCrowdFund.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSavedCrowdFund = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedCrowdFund.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSavedCrowdFund = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.savedCrowdFund.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SavedCrowdFund not found!');
    }
    return result;
});
exports.SavedCrowdFundService = {
    getAllSavedCrowdFund,
    createSavedCrowdFund,
    updateSavedCrowdFund,
    getSingleSavedCrowdFund,
    deleteSavedCrowdFund,
};
