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
exports.FlippingController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const flipping_constant_1 = require("./flipping.constant");
const flipping_service_1 = require("./flipping.service");
const createFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const FlippingData = req.body;
    const user = req.user;
    const id = user.userId;
    const result = yield flipping_service_1.FlippingService.createFlipping(Object.assign(Object.assign({}, FlippingData), { ownById: id, status: client_1.EPropertyStatus.pending }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flipping Created successfully!',
        data: result,
    });
}));
const getAllFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...flipping_constant_1.flippingFilterAbleFields,
        ...flipping_constant_1.flippingFilterByPrice,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield flipping_service_1.FlippingService.getAllFlipping(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flipping retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield flipping_service_1.FlippingService.getSingleFlipping(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flipping retrieved  successfully!',
        data: result,
    });
}));
const updateFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield flipping_service_1.FlippingService.updateFlipping(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flipping Updated successfully!',
        data: result,
    });
}));
const deleteFlipping = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield flipping_service_1.FlippingService.deleteFlipping(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flipping deleted successfully!',
        data: result,
    });
}));
exports.FlippingController = {
    getAllFlipping,
    createFlipping,
    updateFlipping,
    getSingleFlipping,
    deleteFlipping,
};
