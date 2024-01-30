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
exports.CurrencyRequestService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const creeateInvoice_1 = __importDefault(require("../../../helpers/creeateInvoice"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currencyRequest_constant_1 = require("./currencyRequest.constant");
const getAllCurrencyRequest = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = currencyRequest_constant_1.currencyRequestSearchableFields.map(single => {
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
    const result = yield prisma_1.default.currencyRequest.findMany({
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
    const total = yield prisma_1.default.currencyRequest.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createCurrencyRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = yield prisma_1.default.currencyRequest.create({
        data: payload,
        include: {
            ownBy: true,
        },
    });
    return newCurrencyRequest;
});
const createCurrencyRequestInvoice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = yield prisma_1.default.currencyRequest.create({
        data: Object.assign(Object.assign({}, payload), { message: 'auto', status: client_1.EStatusOfCurrencyRequest.pending }),
        include: {
            ownBy: true,
        },
    });
    if (!newCurrencyRequest) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Invoie');
    }
    const data = yield (0, creeateInvoice_1.default)({
        price_amount: newCurrencyRequest.amount,
        order_id: newCurrencyRequest.id,
        ipn_callback_url: '/currency-request/nowpayments-ipn',
        success_url: config_1.default.frontendUrl || '',
        cancel_url: config_1.default.frontendUrl || '',
    });
    console.log('res', data.invoice_url);
    return Object.assign(Object.assign({}, newCurrencyRequest), { url: data.invoice_url });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCurrencyRequestIpn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('nowpayments-ipn data', data);
    // change status of currency Request and add money to user
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
    // const result = await prisma.currencyRequest.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // return result;
});
const getSingleCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currencyRequest.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateCurrencyRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is already status is approved?
    const queryData = yield prisma_1.default.currencyRequest.findFirst({ where: { id } });
    if (!queryData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Data not found!');
    }
    if (queryData.status === client_1.EStatusOfCurrencyRequest.approved) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already approved!');
    }
    if (payload.status === client_1.EStatusOfCurrencyRequest.approved) {
        // start updating
        const updatedCurrencyRequest = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield tx.currencyRequest.update({
                where: {
                    id,
                },
                data: payload,
            });
            // get previous currency
            const previousCurrency = yield tx.currency.findFirst({
                where: { ownById: result.ownById },
            });
            if (!previousCurrency) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User currency not found');
            }
            // update currency
            const newAddedAmount = result.amount * config_1.default.currencyPerDollar;
            const newAmount = previousCurrency.amount + newAddedAmount;
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const updateCurrency = yield tx.currency.update({
                where: { ownById: result.ownById },
                data: { amount: newAmount },
            });
            const queryUser = yield prisma_1.default.user.findUnique({
                where: { id: queryData.ownById },
            });
            if (!queryUser) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
            }
            yield (0, sendEmail_1.default)({ to: queryUser === null || queryUser === void 0 ? void 0 : queryUser.email }, {
                subject: EmailTemplates_1.default.confirmEmailForCurrencyPurchase.subject,
                html: EmailTemplates_1.default.confirmEmailForCurrencyPurchase.html({
                    currencyAmount: newAddedAmount,
                    currentAmount: newAmount,
                }),
            });
            return result;
        }));
        return updatedCurrencyRequest;
    }
    else {
        const result = yield prisma_1.default.currencyRequest.update({
            where: {
                id,
            },
            data: payload,
        });
        return result;
    }
});
const deleteCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currencyRequest.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'CurrencyRequest not found!');
    }
    return result;
});
exports.CurrencyRequestService = {
    getAllCurrencyRequest,
    createCurrencyRequest,
    updateCurrencyRequest,
    getSingleCurrencyRequest,
    deleteCurrencyRequest,
    createCurrencyRequestInvoice,
    createCurrencyRequestIpn,
};
