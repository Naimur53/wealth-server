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
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const EmailTemplates_1 = __importDefault(require("../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const UpdateCurrencyByRequestAfterPay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // check is request exits
            const isCurrencyRequestExits = yield tx.currencyRequest.findUnique({
                where: { id: data.order_id },
                include: {
                    ownBy: { include: { Currency: true } },
                },
            });
            if (!isCurrencyRequestExits || !isCurrencyRequestExits.ownBy) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
            }
            // user previous currency
            const isUserCurrencyExist = yield tx.currency.findUnique({
                where: { ownById: isCurrencyRequestExits.ownById },
            });
            if (!isUserCurrencyExist) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Currency not found!');
            }
            // change status to approved
            if (isCurrencyRequestExits.status === client_1.EStatusOfCurrencyRequest.pending) {
                //
                yield tx.currencyRequest.update({
                    where: { id: data.order_id },
                    data: {
                        status: client_1.EStatusOfCurrencyRequest.approved,
                        paymentStatus: data.payment_status,
                    },
                });
                // add money to user
                yield tx.currency.update({
                    where: { ownById: isCurrencyRequestExits.ownById },
                    data: {
                        amount: (0, lodash_1.round)(data.price_amount + isUserCurrencyExist.amount, config_1.default.calculationMoneyRound),
                    },
                });
            }
        }));
    }
    catch (err) {
        (0, sendEmail_1.default)({ to: config_1.default.emailUser || '' }, {
            subject: EmailTemplates_1.default.currencyRequestPaymentSuccessButFailed.subject,
            html: EmailTemplates_1.default.currencyRequestPaymentSuccessButFailed.html({
                failedSavedData: JSON.stringify(data),
            }),
        });
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went worg');
    }
});
exports.default = UpdateCurrencyByRequestAfterPay;
