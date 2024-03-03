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
exports.PromotionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const promotion_service_1 = require("./promotion.service");
const createPromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const PromotionData = req.body;
    const result = yield promotion_service_1.PromotionService.createPromotion(PromotionData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion Created successfully!',
        data: result,
    });
}));
const addInterestInPromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionInterest = req.body;
    const user = req.user;
    const result = yield promotion_service_1.PromotionService.addInterestInPromotion(Object.assign(Object.assign({}, promotionInterest), { userId: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion Created successfully!',
        data: result,
    });
}));
const removeInterestInPromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promotionInterest = req.body;
    const user = req.user;
    const result = yield promotion_service_1.PromotionService.removeInterestInPromotion(Object.assign(Object.assign({}, promotionInterest), { userId: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion deleted successfully!',
        data: result,
    });
}));
const getAllPromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promotion_service_1.PromotionService.getAllPromotion();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion retrieved successfully !',
        data: result,
    });
}));
const getSinglePromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield promotion_service_1.PromotionService.getSinglePromotion(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion retrieved  successfully!',
        data: result,
    });
}));
const updatePromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield promotion_service_1.PromotionService.updatePromotion(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion Updated successfully!',
        data: result,
    });
}));
const deletePromotion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield promotion_service_1.PromotionService.deletePromotion(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Promotion deleted successfully!',
        data: result,
    });
}));
exports.PromotionController = {
    getAllPromotion,
    createPromotion,
    updatePromotion,
    getSinglePromotion,
    deletePromotion,
    addInterestInPromotion,
    removeInterestInPromotion,
};
