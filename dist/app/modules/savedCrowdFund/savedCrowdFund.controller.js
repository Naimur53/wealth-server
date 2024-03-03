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
exports.SavedCrowdFundController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const savedCrowdFund_service_1 = require("./savedCrowdFund.service");
const createSavedCrowdFund = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SavedCrowdFundData = req.body;
    const user = req.user;
    const result = yield savedCrowdFund_service_1.SavedCrowdFundService.createSavedCrowdFund(Object.assign(Object.assign({}, SavedCrowdFundData), { ownById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedCrowdFund Created successfully!',
        data: result,
    });
}));
const getAllSavedCrowdFund = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield savedCrowdFund_service_1.SavedCrowdFundService.getAllSavedCrowdFund(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedCrowdFund retrieved successfully !',
        data: result,
    });
}));
const getSingleSavedCrowdFund = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedCrowdFund_service_1.SavedCrowdFundService.getSingleSavedCrowdFund(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedCrowdFund retrieved  successfully!',
        data: result,
    });
}));
const updateSavedCrowdFund = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield savedCrowdFund_service_1.SavedCrowdFundService.updateSavedCrowdFund(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedCrowdFund Updated successfully!',
        data: result,
    });
}));
const deleteSavedCrowdFund = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedCrowdFund_service_1.SavedCrowdFundService.deleteSavedCrowdFund(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedCrowdFund deleted successfully!',
        data: result,
    });
}));
exports.SavedCrowdFundController = {
    getAllSavedCrowdFund,
    createSavedCrowdFund,
    updateSavedCrowdFund,
    getSingleSavedCrowdFund,
    deleteSavedCrowdFund,
};
