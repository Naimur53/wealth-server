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
exports.PromotionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllPromotion = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.promotion.findMany({
        select: {
            id: true,
            date: true,
            title: true,
            streetLocation: true,
            thumbnail: true,
            location: true,
            interesteds: {
                select: {
                    ownBy: {
                        select: {
                            profileImg: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
const createPromotion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newPromotion = yield prisma_1.default.promotion.create({
        data: payload,
    });
    return newPromotion;
});
const getSinglePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.promotion.findUnique({
        where: {
            id,
        },
        include: {
            interesteds: {
                select: {
                    ownBy: {
                        select: {
                            profileImg: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
const updatePromotion = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.promotion.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deletePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.promotion.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Promotion not found!');
    }
    return result;
});
const addInterestInPromotion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAlreadyExist = yield prisma_1.default.promotionInterest.findFirst({
        where: {
            ownById: payload.userId,
            promotionId: payload.promotionId,
        },
    });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already interested!');
    }
    const newInterest = yield prisma_1.default.promotionInterest.create({
        data: {
            promotionId: payload.promotionId,
            ownById: payload.userId,
        },
    });
    return newInterest;
});
const removeInterestInPromotion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAlreadyExist = yield prisma_1.default.promotionInterest.findFirst({
        where: {
            ownById: payload.userId,
            promotionId: payload.promotionId,
        },
    });
    if (!isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'not found!');
    }
    const newInterest = yield prisma_1.default.promotionInterest.delete({
        where: {
            id: isAlreadyExist.id,
        },
    });
    return newInterest;
});
exports.PromotionService = {
    getAllPromotion,
    createPromotion,
    updatePromotion,
    getSinglePromotion,
    deletePromotion,
    addInterestInPromotion,
    removeInterestInPromotion,
};
