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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("../app/modules/auth/auth.service");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const EmailTemplates_1 = __importDefault(require("../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const UpdateSellerAfterPay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isSellerExits = yield prisma_1.default.user.findUnique({
        where: { id: data.order_id },
    });
    if (!isSellerExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (isSellerExits.isApprovedForSeller && isSellerExits.isPaidForSeller) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already been approved for seller and paid');
    }
    yield prisma_1.default.user.update({
        where: { id: isSellerExits.id },
        data: { isPaidForSeller: true, isApprovedForSeller: true },
    });
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // update admin
        try {
            const isAdminExist = yield tx.user.findUnique({
                where: { email: config_1.default.mainAdminEmail },
                include: { Currency: true },
            });
            if (!isAdminExist || !isAdminExist.Currency) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Admin doesn't exits");
            }
            // update amount
            yield tx.currency.update({
                where: { ownById: isAdminExist.id },
                data: {
                    amount: ((_a = isAdminExist.Currency) === null || _a === void 0 ? void 0 : _a.amount) + config_1.default.sellerOneTimePayment,
                },
            });
        }
        catch (err) {
            console.log('something went wrong to findteh admin ');
        }
        // send verification token
        const output = yield auth_service_1.AuthService.resendEmail(isSellerExits.email);
        const { refreshToken } = output, result = __rest(output, ["refreshToken"]);
        yield (0, sendEmail_1.default)({ to: result.user.email }, {
            subject: EmailTemplates_1.default.verify.subject,
            html: EmailTemplates_1.default.verify.html({ token: refreshToken }),
        });
    }));
});
exports.default = UpdateSellerAfterPay;
