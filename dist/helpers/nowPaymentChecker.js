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
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const nowPaymentChecker = (payment_id) => __awaiter(void 0, void 0, void 0, function* () {
    const nowPaymentsApiKey = config_1.default.nowPaymentApiKey || '';
    const defaultUrl = config_1.default.nowPaymentInvoiceUrl || '';
    const url = defaultUrl.replace('/invoice', '/payment');
    const outputUrl = url + '/' + payment_id;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const ouputof = yield axios_1.default.get(outputUrl, {
            headers: {
                'x-api-key': nowPaymentsApiKey,
                'Content-Type': 'application/json',
            },
        });
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
    }
});
exports.default = nowPaymentChecker;
