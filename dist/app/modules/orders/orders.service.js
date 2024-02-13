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
exports.OrdersService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const orders_constant_1 = require("./orders.constant");
const getAllOrders = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = orders_constant_1.ordersSearchableFields.map(single => {
            const query = {
                [single]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            };
            return query;
        });
        andCondition.push({
            OR: searchAbleFields,
        });
    }
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.orders.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.orders.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createOrders = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isAccountExits = yield prisma_1.default.account.findUnique({
        where: {
            id: payload.accountId,
            approvedForSale: client_1.EApprovedForSale.approved,
        },
    });
    if (!isAccountExits) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    // check user exits and dose user have enough currency to buy
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: payload.orderById },
        select: {
            id: true,
            email: true,
            Currency: { select: { amount: true, id: true } },
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    //check buyer is not the the owner of this account
    if (isAccountExits.ownById === isUserExist.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Account owner can not buy their account !');
    }
    // check is account already sold
    if (isAccountExits.isSold) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This account already sold');
    }
    // get seller info
    const isSellerExist = yield prisma_1.default.user.findUnique({
        where: { id: isAccountExits.ownById },
        select: {
            id: true,
            email: true,
            role: true,
            Currency: { select: { amount: true, id: true } },
        },
    });
    // the only 10 percent will receive by admin and expect the 10 percent seller will receive
    // get admin info
    const isAdminExist = yield prisma_1.default.user.findFirst({
        where: { email: config_1.default.mainAdminEmail },
        select: {
            id: true,
            email: true,
            Currency: { select: { amount: true, id: true } },
        },
    });
    if (!((_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.Currency) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong currency not found for this user!');
    }
    const serviceCharge = (config_1.default.accountSellServiceCharge / 100) * isAccountExits.price;
    const amountToCutFromTheBuyer = serviceCharge + isAccountExits.price;
    if (amountToCutFromTheBuyer > isUserExist.Currency.amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough currency left to by this account!');
    }
    if (!isSellerExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    if (!(isSellerExist === null || isSellerExist === void 0 ? void 0 : isSellerExist.Currency)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong currency not found for this seller!');
    }
    if (!(isAdminExist === null || isAdminExist === void 0 ? void 0 : isAdminExist.id)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
        // return
    }
    if (!((_b = isAdminExist.Currency) === null || _b === void 0 ? void 0 : _b.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong currency not found for this seller!');
    }
    //
    const sellerFee = (config_1.default.accountSellPercentage / 100) * isAccountExits.price;
    const sellerReceive = isAccountExits.price - sellerFee;
    // const newAmountForAdmin =
    //   isSellerExist.role === UserRole.admin
    //     ? round(
    //         isAdminExist.Currency.amount + isAccountExits.price,
    //         config.calculationMoneyRound
    //       )
    //     : round(
    //         isAdminExist.Currency.amount + adminFee,
    //         config.calculationMoneyRound
    //       );
    const data = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const removeCurrencyFromUser = yield tx.currency.update({
            where: { ownById: isUserExist.id },
            data: {
                amount: {
                    decrement: (0, lodash_1.round)(amountToCutFromTheBuyer, config_1.default.calculationMoneyRound),
                },
            },
        });
        if (removeCurrencyFromUser.amount < 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong tray again latter ');
        }
        const isAdmin = isSellerExist.role === client_1.UserRole.admin;
        const isSuperAdmin = isSellerExist.role === client_1.UserRole.superAdmin;
        if (isAdmin || isSuperAdmin) {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const addCurrencyToAdmin = yield tx.currency.update({
                where: { ownById: isAdminExist.id },
                data: {
                    amount: {
                        increment: (0, lodash_1.round)(isAccountExits.price + serviceCharge, config_1.default.calculationMoneyRound),
                    },
                },
            });
        }
        else {
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const addCurrencyToSeller = yield tx.currency.update({
                where: { ownById: isAccountExits.ownById },
                data: {
                    amount: {
                        increment: (0, lodash_1.round)(sellerReceive, config_1.default.calculationMoneyRound),
                    },
                },
            });
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const addCurrencyToAdmin = yield tx.currency.update({
                where: { ownById: isAdminExist.id },
                data: {
                    amount: {
                        increment: (0, lodash_1.round)(sellerFee + serviceCharge),
                    },
                },
            });
        }
        //changer status of account is sold
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const update = yield tx.account.update({
            where: { id: payload.accountId },
            data: { isSold: true },
        });
        const newOrders = yield tx.orders.create({
            data: payload,
        });
        if (!newOrders) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'dffdfdf');
        }
        return newOrders;
    }));
    yield (0, sendEmail_1.default)({ to: isUserExist.email }, {
        subject: EmailTemplates_1.default.orderSuccessful.subject,
        html: EmailTemplates_1.default.orderSuccessful.html({
            accountName: isAccountExits.name,
            accountPassword: isAccountExits.password,
            accountUserName: isAccountExits.username,
        }),
    });
    yield prisma_1.default.cart.deleteMany({
        where: {
            AND: [
                { accountId: isAccountExits.id },
                { ownById: isUserExist.id },
                // Add more conditions if needed
            ],
        },
    });
    return data;
});
const getSingleOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const getMyOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.findMany({
        where: {
            orderById: id,
        },
        include: {
            account: {
                include: {
                    ownBy: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    return result;
});
const updateOrders = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Orders not found!');
    }
    return result;
});
exports.OrdersService = {
    getAllOrders,
    createOrders,
    updateOrders,
    getSingleOrders,
    deleteOrders,
    getMyOrders,
};
