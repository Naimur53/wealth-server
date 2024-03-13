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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const paystackPayment_1 = require("../../../helpers/paystackPayment");
const common_1 = require("../../../interfaces/common");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateId_1 = __importDefault(require("../../../utils/generateId"));
const user_constant_1 = require("./user.constant");
const getAllUser = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = user_constant_1.userSearchableFields.map(single => {
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
                    equals: key === 'isChapmion'
                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            JSON.parse(filterData[key])
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                id: 'desc',
            },
        select: {
            email: true,
            id: true,
            name: true,
            profileImg: true,
            role: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
            isBlocked: true,
            status: true,
            phoneNumber: true,
            dateOfBirth: true,
            gender: true,
            location: true,
            isChampion: true,
            deviceNotificationToken: true,
            isPaid: true,
            txId: true,
            shouldSendNotification: true,
        },
    });
    const total = yield prisma_1.default.user.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma_1.default.user.create({
        data: payload,
    });
    return newUser;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUser = (id, payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, status } = payload, rest = __rest(payload, ["password", "status"]);
    let genarateBycryptPass;
    if (password) {
        genarateBycryptPass = yield (0, createBycryptPassword_1.default)(password);
    }
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    const isRoleExits = rest.role;
    const isRoleNotMatch = isUserExist.role !== rest.role;
    const isRequestedUSerNotSuperAdmin = requestedUser.role !== client_1.UserRole.superAdmin;
    if (isRoleExits && isRoleNotMatch && isRequestedUSerNotSuperAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User role can only be changed by super admin');
    }
    const isChangeChampion = Boolean(payload.isChampion !== undefined);
    if (isChangeChampion && isRequestedUSerNotSuperAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Champion can only set by admin');
    }
    const isBlockChampion = Boolean(payload.isChampion !== undefined);
    if (isBlockChampion && isRequestedUSerNotSuperAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Block can only set by admin');
    }
    // if (requestedUser.role === UserRole.user && payload.status) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'only admin and super admin can verify seller '
    //   );
    // }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: genarateBycryptPass
            ? Object.assign(Object.assign({}, rest), { password: genarateBycryptPass }) : rest,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Inside the transaction, perform your database operations
        // eslint-disable-next-line no-unused-vars, , @typescript-eslint/no-unused-vars
        const deleteAccount = yield tx.verificationOtp.deleteMany({
            where: { ownById: id },
        });
        const deleteUser = yield tx.user.delete({ where: { id } });
        return deleteUser;
    }));
});
const generateUserPay = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    // if (isUserExist.isPaid) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'already paid');
    // }
    // add tx id
    const request = yield (0, paystackPayment_1.initiatePayment)(config_1.default.sellerOneTimePayment, isUserExist.email, (0, generateId_1.default)(), common_1.EPaymentType.user, isUserExist.id, config_1.default.frontendUrl);
    const output = yield prisma_1.default.user.update({
        where: { id },
        data: { txId: request.data.authorization_url },
    });
    return output;
});
const adminOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrder = yield prisma_1.default.orders.count();
    const totalOrderComplete = yield prisma_1.default.orders.count({
        where: { status: 'success' },
    });
    const totalUser = yield prisma_1.default.user.count({
        where: { role: 'user', isChampion: false },
    });
    const totalAdmin = yield prisma_1.default.user.count({
        where: { role: 'admin', isChampion: false },
    });
    const totalChampion = yield prisma_1.default.user.count({
        where: { role: 'admin', isChampion: false },
    });
    const totalCrowdFund = yield prisma_1.default.crowdFund.count();
    const totalFlipping = yield prisma_1.default.flipping.count();
    const totalProperty = yield prisma_1.default.property.count();
    return {
        totalAdmin,
        totalChampion,
        totalUser,
        totalCrowdFund,
        totalFlipping,
        totalProperty,
        totalOrder,
        totalOrderComplete,
    };
});
// const sellerOverview = async (id: string): Promise<TSellerOverview | null> => {
//   const totalAccount = await prisma.account.count({ where: { ownById: id } });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalAccount,
//     totalSoldAccount,
//     totalOrder,
//     totalMoney,
//   };
// };
// const userOverview = async (id: string): Promise<TUserOverview | null> => {
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalAccountOnCart = await prisma.cart.count({
//     where: { ownById: id },
//   });
//   // const totalOrder = await prisma.account.count({ where: { ownById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalOrder,
//     totalAccountOnCart,
//     totalMoney,
//   };
// };
const sendUserQuery = (id, description, queryType) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found!');
    }
    const transport = yield nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config_1.default.emailUser,
            pass: config_1.default.emailUserPass,
        },
    });
    // const transport = await nodemailer.createTransport({
    //   host: 'mail.privateemail.com', // or 'smtp.privateemail.com'
    //   port: 587, // or 465 for SSL
    //   secure: false, // true for 465, false for 587
    //   auth: {
    //     user: config.emailUser,
    //     pass: config.emailUserPass,
    //   },
    //   tls: {
    //     // Enable TLS encryption
    //     ciphers: 'SSLv3',
    //   },
    // });
    // send mail with defined transport object
    const mailOptions = {
        from: config_1.default.emailUser,
        to: config_1.default.emailUser,
        subject: `${isUserExist.name} asked a Query about ${queryType}`,
        text: `
    This query asked from ${isUserExist.email}

    The query:${description}
    `,
    };
    try {
        yield transport.sendMail(Object.assign({}, mailOptions));
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sorry try again after some time');
    }
});
exports.UserService = {
    getAllUser,
    createUser,
    updateUser,
    getSingleUser,
    deleteUser,
    sendUserQuery,
    generateUserPay,
    adminOverview,
    // sellerOverview,
    // userOverview,
};
