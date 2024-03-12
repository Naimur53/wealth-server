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
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const paystackPayment_1 = require("../../../helpers/paystackPayment");
const common_1 = require("../../../interfaces/common");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateId_1 = __importDefault(require("../../../utils/generateId"));
const orders_constant_1 = require("./orders.constant");
const orders_multiHandler_1 = require("./orders.multiHandler");
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
        include: {
            crowdFund: true,
            flipping: true,
            property: true,
            wealthBank: true,
            orderBy: {
                select: {
                    email: true,
                    id: true,
                    name: true,
                    profileImg: true,
                },
            },
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
    const refName = payload.refName;
    let amount = 0;
    let isExits;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: payload.orderById },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not exits');
    }
    const isOrderAlreadyExist = yield prisma_1.default.orders.findFirst({
        where: {
            orderById: payload.orderById,
            refName: refName,
            status: 'pending',
            crowdFundId: payload.crowdFundId,
            propertyId: payload.propertyId,
            flippingId: payload.flippingId,
        },
    });
    if (isOrderAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already order this item wait form confirmation');
    }
    // if wealBank exits
    if (payload.wealthBankId) {
        if (payload.paymentType === client_1.EOrderPaymentType.paystack) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'wealth Bank id is not allowed on paystack payment');
        }
        const isBankIdExits = yield prisma_1.default.bank.findUnique({
            where: { id: payload.wealthBankId },
        });
        if (!isBankIdExits) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Bank id is not valid');
        }
    }
    // for crowd Fund
    if (refName === client_1.EOrderRefName.crowdFund) {
        if (!payload.crowdFundId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'crowFund id is required');
        }
        isExits = yield prisma_1.default.crowdFund.findUnique({
            where: { id: payload.crowdFundId },
        });
        amount = payload.amount;
    }
    // for flipping
    else if (refName === client_1.EOrderRefName.flipping) {
        if (!payload.flippingId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'flipping id is required');
        }
        isExits = yield prisma_1.default.flipping.findUnique({
            where: { id: payload.flippingId },
        });
        if (!isExits) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'data not found');
        }
        amount = isExits.price;
    }
    // for flipping
    else if (refName === client_1.EOrderRefName.property) {
        if (!payload.propertyId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'property id is required');
        }
        isExits = yield prisma_1.default.property.findUnique({
            where: { id: payload.propertyId },
        });
        if (!isExits) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'data not found');
        }
        amount = isExits === null || isExits === void 0 ? void 0 : isExits.price;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    if (payload.paymentType === client_1.EOrderPaymentType.manual) {
        // send a email to notify admin
    }
    if (!isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `${refName} does not exist to orders`);
    }
    if (!amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Amount not found!');
    }
    // create pay stack url and add it
    const newOrders = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield tx.orders.create({
            data: Object.assign(Object.assign({}, payload), { amount }),
        });
        if (payload.paymentType === client_1.EOrderPaymentType.paystack) {
            const payId = (0, generateId_1.default)();
            if (amount * 100 > 2000000) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, '2000000NG is not allowed to paystack payment');
            }
            const request = yield (0, paystackPayment_1.initiatePayment)(amount, isUserExist.email, payId, common_1.EPaymentType.order, result.id, config_1.default.frontendUrl);
            const url = (_a = request === null || request === void 0 ? void 0 : request.data) === null || _a === void 0 ? void 0 : _a.authorization_url;
            return yield tx.orders.update({
                where: { id: result.id },
                data: { paystackUrl: url, paystackId: payId },
            });
        }
        return result;
    }));
    return newOrders;
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
    // check is property exits
    const isOrderExits = yield prisma_1.default.orders.findUnique({
        where: { id },
    });
    if (payload.refName) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'You can not update');
    }
    if (!isOrderExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order not found ');
    }
    const refName = isOrderExits.refName;
    const isOrderPending = isOrderExits.status === client_1.EOrderStatus.pending;
    const isNewStatusIsSuccess = payload.status === client_1.EOrderStatus.success;
    if (isNewStatusIsSuccess && isOrderPending) {
        // check product is sold or not
        const isExits = yield orders_multiHandler_1.multiHandler.findUniqueEntity(refName, {
            crowdFundId: isOrderExits.crowdFundId || '',
            flippingId: isOrderExits.flippingId || '',
            propertyId: isOrderExits.propertyId || '',
        });
        if (!isExits) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `${refName} is not found!`);
        }
        if (isExits.status === 'sold') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Items already sold');
        }
        const output = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // crowd fund
            if (refName === client_1.EOrderRefName.crowdFund) {
                if (!isOrderExits.crowdFundId) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'crowFund id is required');
                }
                const preCrowdFund = yield tx.crowdFund.findUnique({
                    where: { id: isOrderExits.crowdFundId },
                });
                if (!preCrowdFund) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Crowdfund not found');
                }
                const newRaise = preCrowdFund.fundRaised + isOrderExits.amount;
                let status = preCrowdFund.status;
                if (newRaise > preCrowdFund.targetFund) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Amount is not valid');
                }
                else if (newRaise === isOrderExits.amount) {
                    status = 'sold';
                }
                // check is
                const newFund = yield tx.crowdFund.update({
                    where: { id: isOrderExits.crowdFundId },
                    data: {
                        status,
                        fundRaised: { increment: isOrderExits.amount },
                    },
                });
                if (newFund.fundRaised > newFund.targetFund) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough fund left to buy!');
                }
            }
            // for flipping
            else if (refName === client_1.EOrderRefName.flipping) {
                if (!isOrderExits.flippingId) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'flipping id is required');
                }
                yield tx.flipping.update({
                    where: { id: isOrderExits.flippingId },
                    data: { status: client_1.EPropertyStatus.sold },
                });
            }
            // for property
            else if (refName === client_1.EOrderRefName.property) {
                if (!isOrderExits.propertyId) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'property id is required');
                }
                yield tx.property.update({
                    where: { id: isOrderExits.propertyId },
                    data: { status: client_1.EPropertyStatus.sold },
                });
            }
            else {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
            }
            return yield tx.orders.update({ where: { id }, data: payload });
        }));
        return output;
    }
    else {
        const result = yield prisma_1.default.orders.update({
            where: {
                id,
            },
            data: payload,
        });
        return result;
    }
});
const deleteOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExits = yield prisma_1.default.orders.findUnique({
        where: { id },
    });
    if (!isOrderExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Data not found');
    }
    if (isOrderExits.status === client_1.EOrderStatus.success) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Status is success you can not delete data');
    }
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
