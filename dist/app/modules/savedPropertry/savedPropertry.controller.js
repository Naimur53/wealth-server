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
exports.SavedPropertryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const savedPropertry_service_1 = require("./savedPropertry.service");
const createSavedPropertry = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SavedPropertryData = req.body;
    const user = req.user;
    const result = yield savedPropertry_service_1.SavedPropertryService.createSavedPropertry(Object.assign(Object.assign({}, SavedPropertryData), { ownById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedPropertry Created successfully!',
        data: result,
    });
}));
const getAllSavedPropertry = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield savedPropertry_service_1.SavedPropertryService.getAllSavedPropertry(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedPropertry retrieved successfully !',
        data: result,
    });
}));
const getSingleSavedPropertry = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedPropertry_service_1.SavedPropertryService.getSingleSavedPropertry(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedPropertry retrieved  successfully!',
        data: result,
    });
}));
const updateSavedPropertry = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield savedPropertry_service_1.SavedPropertryService.updateSavedPropertry(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedPropertry Updated successfully!',
        data: result,
    });
}));
const deleteSavedPropertry = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield savedPropertry_service_1.SavedPropertryService.deleteSavedPropertry(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SavedPropertry deleted successfully!',
        data: result,
    });
}));
exports.SavedPropertryController = {
    getAllSavedPropertry,
    createSavedPropertry,
    updateSavedPropertry,
    getSingleSavedPropertry,
    deleteSavedPropertry,
};
