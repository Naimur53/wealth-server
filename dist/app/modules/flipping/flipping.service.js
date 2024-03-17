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
exports.FlippingService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const flipping_constant_1 = require("./flipping.constant");
const getAllFlipping = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, maxPrice, minPrice } = filters, filterData = __rest(filters, ["searchTerm", "maxPrice", "minPrice"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = flipping_constant_1.flippingSearchableFields.map(single => {
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
    if (maxPrice) {
        andCondition.push({
            price: {
                lte: Number(maxPrice),
            },
        });
    }
    if (minPrice) {
        andCondition.push({
            price: {
                gte: Number(minPrice),
            },
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.flipping.findMany({
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
            Orders: {
                where: {
                    status: 'success',
                },
                select: {
                    orderBy: {
                        select: {
                            email: true,
                            id: true,
                            profileImg: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.flipping.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createFlipping = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newFlipping = yield prisma_1.default.flipping.create({
        data: Object.assign(Object.assign({}, payload), { status: 'pending' }),
        include: {
            ownBy: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });
    yield (0, sendEmail_1.default)({ to: newFlipping.ownBy.email }, {
        subject: EmailTemplates_1.default.userListAProperty.subject,
        html: EmailTemplates_1.default.userListAProperty.html(),
    });
    return newFlipping;
});
const getSingleFlipping = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flipping.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateFlipping = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flipping.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteFlipping = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.flipping.findUnique({ where: { id } });
    if (!isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'property not found');
    }
    if (isExits.status === client_1.EPropertyStatus.sold) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'sold crowd fund cannot be deleted');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.savedFlipping.deleteMany({ where: { flippingId: id } });
        yield tx.savedFlipping.deleteMany({ where: { flippingId: id } });
        return yield tx.flipping.delete({
            where: { id },
        });
    }));
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Flipping not found!');
    }
    return result;
});
exports.FlippingService = {
    getAllFlipping,
    createFlipping,
    updateFlipping,
    getSingleFlipping,
    deleteFlipping,
};
