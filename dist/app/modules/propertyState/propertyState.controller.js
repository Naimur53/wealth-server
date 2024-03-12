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
exports.PropertyStateController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const propertyState_constant_1 = require("./propertyState.constant");
const propertyState_service_1 = require("./propertyState.service");
const createPropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const PropertyStateData = req.body;
    const result = yield propertyState_service_1.PropertyStateService.createPropertyState(PropertyStateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState Created successfully!',
        data: result,
    });
}));
const createMultiPropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const PropertyStateData = req.body;
    const result = yield propertyState_service_1.PropertyStateService.createMultiPropertyState(PropertyStateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState Created successfully!',
        data: result,
    });
}));
// const getSingleAllPropertyState = catchAsync(
//   async (req: Request, res: Response) => {
//     const info = req.body;
//     const result = await PropertyStateService.getSingleAllPropertyState(
//       info.id,
//       info.type
//     );
//     sendResponse<PropertyState[]>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'PropertyState retrieved successfully !',
//       data: result,
//     });
//   }
// );
const getAllPropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...propertyState_constant_1.propertyStateFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield propertyState_service_1.PropertyStateService.getAllPropertyState(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSinglePropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield propertyState_service_1.PropertyStateService.getSinglePropertyState(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState retrieved  successfully!',
        data: result,
    });
}));
const updatePropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield propertyState_service_1.PropertyStateService.updatePropertyState(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState Updated successfully!',
        data: result,
    });
}));
const deletePropertyState = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield propertyState_service_1.PropertyStateService.deletePropertyState(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'PropertyState deleted successfully!',
        data: result,
    });
}));
exports.PropertyStateController = {
    getAllPropertyState,
    createPropertyState,
    updatePropertyState,
    getSinglePropertyState,
    deletePropertyState,
    createMultiPropertyState,
};
