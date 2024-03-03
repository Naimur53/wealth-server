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
exports.FaqService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllFaq = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.findMany({});
    return result;
});
const createFaq = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newFaq = yield prisma_1.default.faq.create({
        data: payload,
    });
    return newFaq;
});
const getSingleFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateFaq = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteFaq = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faq not found!');
    }
    return result;
});
exports.FaqService = {
    getAllFaq,
    createFaq,
    updateFaq,
    getSingleFaq,
    deleteFaq,
};
