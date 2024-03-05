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
exports.LocationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const location_constant_1 = require("./location.constant");
const getAllLocation = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(Object.assign(Object.assign({}, paginationOptions), { limit: paginationOptions.limit || 100 }));
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = location_constant_1.locationSearchableFields.map(single => {
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
    const result = yield prisma_1.default.location.findMany({
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
            _count: true,
        },
    });
    const total = yield prisma_1.default.location.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createLocation = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.location.findUnique({
        where: { name: payload.name },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Location already exits');
    }
    const newLocation = yield prisma_1.default.location.create({
        data: payload,
    });
    return newLocation;
});
const getSingleLocation = (id, extraInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.findUnique({
        where: {
            id,
        },
        include: Object.assign({}, extraInfo),
    });
    return result;
});
const updateLocation = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteLocation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.property.deleteMany({ where: { locationId: id } });
        yield tx.crowdFund.deleteMany({ where: { locationId: id } });
        return yield tx.location.delete({
            where: { id },
        });
    }));
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Location not found!');
    }
    return result;
});
exports.LocationService = {
    getAllLocation,
    createLocation,
    updateLocation,
    getSingleLocation,
    deleteLocation,
};
