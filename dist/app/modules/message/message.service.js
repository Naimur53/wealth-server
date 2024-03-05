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
exports.MessageService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currentTime_1 = __importDefault(require("../../../utils/currentTime"));
const message_constant_1 = require("./message.constant");
const getAllMessage = (filters, paginationOptions, groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    // const chatGroupId= filterData.chatGroupId;
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = message_constant_1.messageSearchableFields.map(single => {
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
    let result = yield prisma_1.default.message.findMany({
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
            reply: {
                include: {
                    sendBy: {
                        select: {
                            email: true,
                            id: true,
                            name: true,
                            role: true,
                            isChampion: true,
                            profileImg: true,
                        },
                    },
                },
            },
            sendBy: {
                select: {
                    email: true,
                    id: true,
                    name: true,
                    profileImg: true,
                    role: true,
                    isChampion: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.message.count();
    const isSeenMessageExits = yield prisma_1.default.seenMessage.findUnique({
        where: { seenById: userId, groupId: groupId },
    });
    let unSeenCount = 0;
    if (isSeenMessageExits) {
        result = result.map(single => {
            const isSeen = new Date(isSeenMessageExits.lastSeen) >= new Date(single.createdAt);
            if (!isSeen) {
                unSeenCount++;
            }
            return Object.assign(Object.assign({}, single), { isSeen });
        });
    }
    const output = {
        data: result,
        meta: { page, limit, total, unSeenCount },
    };
    return output;
});
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isGroupExits = yield prisma_1.default.chatGroup.findUnique({
        where: { id: payload.chatGroupId },
    });
    if (!isGroupExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Group not found');
    }
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: payload.sendById },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    //
    const isAdminGroup = isGroupExits.type === client_1.EChatGroupType.admin;
    const isChampionGroup = isGroupExits.type === client_1.EChatGroupType.champion;
    if (isAdminGroup && isUserExist.role === client_1.UserRole.user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User cannot send message to admin group');
    }
    if (isChampionGroup && !isUserExist.isChampion) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Normal user cant not send message to champion group');
    }
    const newMessage = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.seenMessage.upsert({
            where: {
                groupId: payload.chatGroupId,
                seenById: payload.sendById,
            },
            update: {
                groupId: payload.chatGroupId,
                seenById: payload.sendById,
                lastSeen: (0, currentTime_1.default)(),
            },
            create: {
                groupId: payload.chatGroupId,
                seenById: payload.sendById,
                lastSeen: (0, currentTime_1.default)(),
            },
        });
        return yield tx.message.create({
            data: payload,
            include: {
                sendBy: {
                    select: {
                        email: true,
                        id: true,
                        name: true,
                        role: true,
                        isChampion: true,
                        profileImg: true,
                    },
                },
                reply: {
                    include: {
                        sendBy: {
                            select: {
                                email: true,
                                id: true,
                                name: true,
                                role: true,
                                isChampion: true,
                                profileImg: true,
                            },
                        },
                    },
                },
            },
        });
    }));
    return newMessage;
});
const getSingleMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateMessage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Message not found!');
    }
    return result;
});
exports.MessageService = {
    getAllMessage,
    createMessage,
    updateMessage,
    getSingleMessage,
    deleteMessage,
};
