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
exports.AccountService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const account_constant_1 = require("./account.constant");
const getAllAccount = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = account_constant_1.accountSearchableFields.map(single => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyChecker = (data, key) => {
        const keysToCheck = ['isSold'];
        if (keysToCheck.includes(key)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return JSON.parse(filterData[key]);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return filterData[key];
    };
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    equals: keyChecker(filterData, key),
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.account.findMany({
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
        select: {
            id: true,
            category: true,
            approvedForSale: true,
            description: true,
            createdAt: true,
            isSold: true,
            Cart: true,
            name: true,
            price: true,
            updatedAt: true,
            ownById: true,
            ownBy: {
                select: {
                    name: true,
                    profileImg: true,
                    email: true,
                    id: true,
                    isVerified: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.account.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const isAccountOwnerExits = yield prisma_1.default.user.findUnique({
        where: { id: payload.ownById },
    });
    if (!isAccountOwnerExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (isAccountOwnerExits.role === client_1.UserRole.seller &&
        !isAccountOwnerExits.isApprovedForSeller) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Your are not approved as seller');
    }
    const newAccount = yield prisma_1.default.account.create({
        data: payload,
    });
    return newAccount;
});
const getSingleAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.account.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateAccount = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExits = yield prisma_1.default.account.findUnique({ where: { id } });
    if (!isAccountExits) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found!');
    }
    if (isAccountExits.isSold) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "sold account can't be updated!");
    }
    const result = yield prisma_1.default.account.update({
        where: {
            id,
        },
        data: payload,
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { username, password } = result, rest = __rest(result, ["username", "password"]);
    return rest;
});
const deleteAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExits = yield prisma_1.default.account.findUnique({ where: { id } });
    if (!isAccountExits) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Account not found!');
    }
    if (isAccountExits.isSold) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "sold account can't be delete!");
    }
    const result = yield prisma_1.default.account.delete({
        where: { id },
    });
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { username, password } = result, rest = __rest(result, ["username", "password"]);
    return rest;
});
exports.AccountService = {
    getAllAccount,
    createAccount,
    updateAccount,
    getSingleAccount,
    deleteAccount,
};
