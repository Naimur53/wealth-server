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
exports.SavedFlippingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const savedFlipping_service_1 = require("./savedFlipping.service");
const createSavedFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SavedFlippingData = req.body;
    const user = req.user;
    const result = yield savedFlipping_service_1.SavedFlippingService.createSavedFlipping(Object.assign(Object.assign({}, SavedFlippingData), { ownById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedFlipping Created successfully!',
        data: result,
    });
}));
const getAllSavedFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield savedFlipping_service_1.SavedFlippingService.getAllSavedFlipping(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedFlipping retrieved successfully !',
        data: result,
    });
}));
const getSingleSavedFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedFlipping_service_1.SavedFlippingService.getSingleSavedFlipping(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedFlipping retrieved  successfully!',
        data: result,
    });
}));
const updateSavedFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield savedFlipping_service_1.SavedFlippingService.updateSavedFlipping(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedFlipping Updated successfully!',
        data: result,
    });
}));
const deleteSavedFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedFlipping_service_1.SavedFlippingService.deleteSavedFlipping(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedFlipping deleted successfully!',
        data: result,
    });
}));
exports.SavedFlippingController = {
    getAllSavedFlipping,
    createSavedFlipping,
    updateSavedFlipping,
    getSingleSavedFlipping,
    deleteSavedFlipping,
};
