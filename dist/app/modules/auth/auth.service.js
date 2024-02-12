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
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const creeateInvoice_1 = __importDefault(require("../../../helpers/creeateInvoice"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const paystackPayment_1 = require("../../../helpers/paystackPayment");
const common_1 = require("../../../interfaces/common");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_service_1 = require("../user/user.service");
const createUser = (user, paymentWithPaystack) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is user buyer
    const { password: givenPassword } = user, rest = __rest(user, ["password"]);
    let newUser;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: user.email },
    });
    // if user and account exits
    if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id) && isUserExist.role === client_1.UserRole.user) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User already exits');
    }
    // if seller and already exist
    if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id) && isUserExist.role === client_1.UserRole.seller) {
        // user all ready paid
        if (isUserExist.isApprovedForSeller) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Seller already Exits ');
        }
        else {
            // seller account created but not paid , will let tme update and create it
            const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(givenPassword);
            // start new  transection  for new user
            // delete that user
            yield user_service_1.UserService.deleteUser(isUserExist.id);
            // start new  transection  for new user
            newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                let role = user.role === client_1.UserRole.seller ? client_1.UserRole.seller : client_1.UserRole.user;
                //gard for making super admin
                if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email) === config_1.default.mainAdminEmail) {
                    role = client_1.UserRole.superAdmin;
                }
                const newUserInfo = yield tx.user.create({
                    data: Object.assign(Object.assign({ password: genarateBycryptPass }, rest), { role, isVerified: false, isApprovedForSeller: false }),
                });
                yield tx.currency.create({
                    data: {
                        amount: 0,
                        ownById: newUserInfo.id,
                    },
                });
                // is is it seller
                if (newUserInfo.role !== client_1.UserRole.seller) {
                    return newUserInfo;
                }
                if (paymentWithPaystack) {
                    // pay stack
                    const request = yield (0, paystackPayment_1.initiatePayment)(config_1.default.sellerOneTimePayment, newUserInfo.email, newUserInfo.id, common_1.EPaymentType.seller, config_1.default.frontendUrl + `/verify?toEmail=${newUserInfo.email}`);
                    const updateUser = tx.user.update({
                        where: { id: newUserInfo.id },
                        data: { txId: request.data.authorization_url || '' },
                    });
                    return updateUser;
                }
                else {
                    // now payment
                    const data = yield (0, creeateInvoice_1.default)({
                        price_amount: config_1.default.sellerOneTimePayment,
                        order_id: newUserInfo.id,
                        ipn_callback_url: '/users/nowpayments-ipn',
                        order_description: 'Creating Seller Account',
                        success_url: config_1.default.frontendUrl + `/verify?toEmail=${newUserInfo.email}`,
                        cancel_url: config_1.default.frontendUrl || '',
                    });
                    // newUser.txId=data.invoice_url;
                    const updateUser = tx.user.update({
                        where: { id: newUserInfo.id },
                        data: { txId: data.invoice_url },
                    });
                    return updateUser;
                }
            }));
        }
    }
    else {
        const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(givenPassword);
        // start new  transection  for new user
        newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            let role = user.role === client_1.UserRole.seller ? client_1.UserRole.seller : client_1.UserRole.user;
            //gard for making super admin
            if (user.email === config_1.default.mainAdminEmail) {
                role = client_1.UserRole.superAdmin;
            }
            const newUserInfo = yield tx.user.create({
                data: Object.assign(Object.assign({ password: genarateBycryptPass }, rest), { role, isVerified: false, isApprovedForSeller: false }),
            });
            yield tx.currency.create({
                data: {
                    amount: 0,
                    ownById: newUserInfo.id,
                },
            });
            // is is it seller
            if (newUserInfo.role !== client_1.UserRole.seller) {
                return newUserInfo;
            }
            if (paymentWithPaystack) {
                // pay stack
                const request = yield (0, paystackPayment_1.initiatePayment)(config_1.default.sellerOneTimePayment, newUserInfo.email, newUserInfo.id, common_1.EPaymentType.seller, config_1.default.frontendUrl + `/verify?toEmail=${newUserInfo.email}`);
                const updateUser = tx.user.update({
                    where: { id: newUserInfo.id },
                    data: { txId: request.data.authorization_url || '' },
                });
                return updateUser;
            }
            else {
                // now payment
                const data = yield (0, creeateInvoice_1.default)({
                    price_amount: config_1.default.sellerOneTimePayment,
                    order_id: newUserInfo.id,
                    ipn_callback_url: '/users/nowpayments-ipn',
                    order_description: 'Creating Seller Account',
                    success_url: config_1.default.frontendUrl + `/verify?toEmail=${newUserInfo.email}`,
                    cancel_url: config_1.default.frontendUrl || '',
                });
                // newUser.txId=data.invoice_url;
                const updateUser = tx.user.update({
                    where: { id: newUserInfo.id },
                    data: { txId: data.invoice_url },
                });
                return updateUser;
            }
        }));
    }
    if (!newUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'failed to create user');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, id, email, name } = newUser, others = __rest(newUser, ["password", "id", "email", "name"]);
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const refreshTokenSignup = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.refresh_secret_signup, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name }, others),
        accessToken,
        refreshToken,
        refreshTokenSignup,
    };
    // eslint-disable-next-line no-unused-vars
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    console.log(givenEmail);
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.role === client_1.UserRole.seller) {
        if (isUserExist.isApprovedForSeller === false) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Seller does not exits');
        }
    }
    if (isUserExist.password &&
        !(yield bcryptjs_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const resendEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already verified');
    }
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshTokenSignUp = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret_signup, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken: refreshTokenSignUp,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findFirst({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const verifySignupToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret_signup);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId } = verifiedToken;
    // checking deleted user's refresh token
    console.log('the token', userId);
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const result = yield user_service_1.UserService.updateUser(isUserExist.id, {
        isVerified: true,
    }, {});
    if (!result) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const _a = result, { password } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: newAccessToken,
        user: rest,
    };
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
    verifySignupToken,
    resendEmail,
};
