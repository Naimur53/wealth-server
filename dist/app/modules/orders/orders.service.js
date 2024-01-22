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
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isAccountExits = yield tx.account.findUnique({
            where: {
                id: payload.accountId,
                approvedForSale: client_1.EApprovedForSale.approved,
            },
        });
        if (!isAccountExits) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
        }
        // check user exits and dose user have enough currency to buy
        const isUserExist = yield tx.user.findUnique({
            where: { id: payload.orderById },
            include: {
                Currency: true,
            },
        });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
        }
        console.log('order by', isUserExist);
        if (!isUserExist.Currency) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong currency not found for this user!');
        }
        if (isUserExist.Currency.amount < isAccountExits.price) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough currency left to by this account!');
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
        const isSellerExist = yield tx.user.findUnique({
            where: { id: isAccountExits.ownById },
            include: {
                Currency: true,
            },
        });
        console.log('seller', isSellerExist);
        if (!isSellerExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
        }
        if (!isSellerExist.Currency) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong currency not found for this seller!');
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const removeCurrencyFromUser = yield tx.currency.update({
            where: { ownById: isUserExist.id },
            data: {
                amount: isUserExist.Currency.amount - isAccountExits.price,
            },
        });
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const addCurrencyToSeller = yield tx.currency.update({
            where: { ownById: isAccountExits.ownById },
            data: { amount: isSellerExist.Currency.amount + isAccountExits.price },
        });
        //changer status of account is sold
        yield tx.account.update({
            where: { id: payload.accountId },
            data: { isSold: true },
        });
        const newOrders = yield tx.orders.create({
            data: payload,
        });
        (0, sendEmail_1.default)({ to: isUserExist.email }, {
            subject: EmailTemplates_1.default.orderSuccessful.subject,
            html: EmailTemplates_1.default.orderSuccessful.html({
                accountName: isAccountExits.name,
                accountPassword: isAccountExits.password,
                accountUserName: isAccountExits.username,
            }),
        });
        return newOrders;
    }));
});
const getSingleOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.findUnique({
        where: {
            id,
        },
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
};
