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
exports.CurrencyRequestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const pagination_1 = require("../../../constants/pagination");
const UpdateSellerAfterPay_1 = __importDefault(require("../../../helpers/UpdateSellerAfterPay"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const common_1 = require("../../../interfaces/common");
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const catchAsyncSemaphore_1 = __importDefault(require("../../../shared/catchAsyncSemaphore"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const currencyRequest_constant_1 = require("./currencyRequest.constant");
const currencyRequest_service_1 = require("./currencyRequest.service");
const createCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    const userInfo = yield prisma_1.default.user.findFirst({
        where: { id: user.userId },
    });
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequest(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    yield (0, sendEmail_1.default)({ to: config_1.default.emailUser }, {
        subject: EmailTemplates_1.default.requestForCurrencyToAdmin.subject,
        html: EmailTemplates_1.default.requestForCurrencyToAdmin.html({
            amount: result === null || result === void 0 ? void 0 : result.amount,
            userEmail: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email,
            userName: userInfo === null || userInfo === void 0 ? void 0 : userInfo.name,
            userProfileImg: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.profileImg) || '',
        }),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const createCurrencyRequestInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    const userInfo = yield prisma_1.default.user.findFirst({
        where: { id: user.userId },
    });
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestInvoice(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    yield (0, sendEmail_1.default)({ to: config_1.default.emailUser }, {
        subject: EmailTemplates_1.default.requestForCurrencyToAdmin.subject,
        html: EmailTemplates_1.default.requestForCurrencyToAdmin.html({
            amount: result === null || result === void 0 ? void 0 : result.amount,
            userEmail: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email,
            userName: userInfo === null || userInfo === void 0 ? void 0 : userInfo.name,
            userProfileImg: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.profileImg) || '',
        }),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const createCurrencyRequestWithPayStack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestWithPayStack(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const getAllCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...currencyRequest_constant_1.currencyRequestFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield currencyRequest_service_1.CurrencyRequestService.getAllCurrencyRequest(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const payStackWebHook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ipnData = req.body;
    if (ipnData.event === 'charge.success') {
        const paymentReference = ipnData.data.reference;
        // Perform additional actions, such as updating your database, sending emails, etc.
        const paymentType = (_b = (_a = ipnData === null || ipnData === void 0 ? void 0 : ipnData.data) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.payment_type;
        if (paymentType === common_1.EPaymentType.addFunds) {
            yield currencyRequest_service_1.CurrencyRequestService.payStackWebHook({
                reference: paymentReference,
            });
        }
        else if (paymentType === common_1.EPaymentType.seller) {
            yield (0, UpdateSellerAfterPay_1.default)({
                order_id: paymentReference,
                payment_status: 'finished',
                price_amount: config_1.default.sellerOneTimePayment,
            });
        }
    }
    // eslint-disable-next-line no-unused-vars
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: 'succes',
    });
}));
const getSingleCurrencyRequestIpn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ipnData = req.body;
    // eslint-disable-next-line no-unused-vars
    yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestIpn(ipnData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: 'succes',
    });
}));
const getSingleCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield currencyRequest_service_1.CurrencyRequestService.getSingleCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: result,
    });
}));
const updateCurrencyRequest = (0, catchAsyncSemaphore_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield currencyRequest_service_1.CurrencyRequestService.updateCurrencyRequest(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Updated successfully!',
        data: result,
    });
}));
const deleteCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield currencyRequest_service_1.CurrencyRequestService.deleteCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest deleted successfully!',
        data: result,
    });
}));
exports.CurrencyRequestController = {
    getAllCurrencyRequest,
    createCurrencyRequest,
    updateCurrencyRequest,
    getSingleCurrencyRequest,
    deleteCurrencyRequest,
    createCurrencyRequestInvoice,
    getSingleCurrencyRequestIpn,
    createCurrencyRequestWithPayStack,
    payStackWebHook,
};
