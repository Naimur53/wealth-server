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
exports.OrdersController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const orders_constant_1 = require("./orders.constant");
const orders_service_1 = require("./orders.service");
const createOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const OrdersData = req.body;
    const user = req.user;
    // if payment type is manual
    if (OrdersData.paymentType === client_1.EOrderPaymentType.manual) {
        // check does user give all info for manual
        const keys = ['bankName', 'bankAccountNumber'];
        keys.forEach(single => {
            var _a;
            if (!((_a = OrdersData[single]) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Manual payment required' + ' ' + single);
            }
        });
    }
    else {
        if (!OrdersData.wealthBankId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'wealthBankId is required');
        }
    }
    const result = yield orders_service_1.OrdersService.createOrders(Object.assign(Object.assign({}, OrdersData), { status: client_1.EOrderStatus.pending, orderById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders Created successfully!',
        data: result,
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', ...orders_constant_1.ordersFilterAbleFields]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield orders_service_1.OrdersService.getAllOrders(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield orders_service_1.OrdersService.getSingleOrders(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved  successfully!',
        data: result,
    });
}));
const updateOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user;
    const isNotAdmin = user.role !== client_1.UserRole.admin;
    const isNotSuperAdmin = user.role !== client_1.UserRole.superAdmin;
    const isOrderExits = yield prisma_1.default.orders.findUnique({
        where: { id: id },
        select: { orderById: true },
    });
    if (!isOrderExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order not found');
    }
    const isNotOwner = isOrderExits.orderById !== user.userId;
    if (isNotAdmin && isNotSuperAdmin && isNotOwner) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not the owner');
    }
    const result = yield orders_service_1.OrdersService.updateOrders(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders Updated successfully!',
        data: result,
    });
}));
const deleteOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield orders_service_1.OrdersService.deleteOrders(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders deleted successfully!',
        data: result,
    });
}));
exports.OrdersController = {
    getAllOrders,
    createOrders,
    updateOrders,
    getSingleOrders,
    deleteOrders,
};
