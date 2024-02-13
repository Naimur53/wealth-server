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
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { paymentWithPaystack } = _a, data = __rest(_a, ["paymentWithPaystack"]);
    const output = yield auth_service_1.AuthService.createUser(data, paymentWithPaystack);
    const { refreshToken, refreshTokenSignup } = output, result = __rest(output, ["refreshToken", "refreshTokenSignup"]);
    if (output.user.role !== client_1.UserRole.seller) {
        yield (0, sendEmail_1.default)({ to: result.user.email }, {
            subject: EmailTemplates_1.default.verify.subject,
            html: EmailTemplates_1.default.verify.html({
                token: refreshTokenSignup,
            }),
        });
    }
    // if (output.user.role == UserRole.seller) {
    //   await sendEmail(
    //     { to: config.emailUser as string },
    //     {
    //       subject: EmailTemplates.sellerRequest.subject,
    //       html: EmailTemplates.sellerRequest.html({
    //         userEmail: output.user.email,
    //         txId: output.user.txId as string,
    //       }),
    //     }
    //   );
    // }
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user created successfully!',
        data: result,
    });
}));
const resendEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const output = yield auth_service_1.AuthService.resendEmail(email || '');
    const { refreshToken } = output, result = __rest(output, ["refreshToken"]);
    yield (0, sendEmail_1.default)({ to: result.user.email }, {
        subject: EmailTemplates_1.default.verify.subject,
        html: EmailTemplates_1.default.verify.html({ token: refreshToken }),
    });
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user created successfully!',
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = req.body;
    const result = yield auth_service_1.AuthService.loginUser(loginInfo);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User lohggedin successfully !',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New access token generated successfully !',
        data: result,
    });
}));
const verifySignupToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const result = yield auth_service_1.AuthService.verifySignupToken(token);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New access token generated successfully !',
        data: result,
    });
}));
exports.AuthController = {
    createUser,
    loginUser,
    refreshToken,
    verifySignupToken,
    resendEmail,
};
