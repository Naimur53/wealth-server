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
exports.PropertyStateService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const propertyState_constant_1 = require("./propertyState.constant");
const getAllPropertyState = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = propertyState_constant_1.propertyStateSearchableFields.map(single => {
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
    const result = yield prisma_1.default.propertyState.findMany({
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
    const total = yield prisma_1.default.propertyState.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createPropertyState = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isPropertyExits = yield prisma_1.default.property.findUnique({
        where: { id: payload.propertyId },
    });
    if (!isPropertyExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Property not found!');
    }
    // check already data exits on same d
    const time = new Date(payload.time);
    const isAlreadyExist = yield prisma_1.default.propertyState.findFirst({
        where: {
            time: {
                gte: payload.time,
                lt: new Date(time.getTime() + 86400000),
            },
            propertyId: payload.propertyId,
        },
    });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, 'Already exits');
    }
    const newPropertyState = yield prisma_1.default.propertyState.create({
        data: payload,
    });
    return newPropertyState;
});
const getSinglePropertyState = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.propertyState.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updatePropertyState = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.propertyState.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deletePropertyState = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.propertyState.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'PropertyState not found!');
    }
    return result;
});
exports.PropertyStateService = {
    getAllPropertyState,
    createPropertyState,
    updatePropertyState,
    getSinglePropertyState,
    deletePropertyState,
};
