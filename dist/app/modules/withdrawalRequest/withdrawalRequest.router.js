"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequestRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const withdrawalRequest_controller_1 = require("./withdrawalRequest.controller");
const withdrawalRequest_validation_1 = require("./withdrawalRequest.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), withdrawalRequest_controller_1.WithdrawalRequestController.getAllWithdrawalRequest);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), withdrawalRequest_controller_1.WithdrawalRequestController.getSingleWithdrawalRequest);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), (0, validateRequest_1.default)(withdrawalRequest_validation_1.WithdrawalRequestValidation.createValidation), withdrawalRequest_controller_1.WithdrawalRequestController.createWithdrawalRequest);
router.patch('/:id', (0, validateRequest_1.default)(withdrawalRequest_validation_1.WithdrawalRequestValidation.updateValidation), withdrawalRequest_controller_1.WithdrawalRequestController.updateWithdrawalRequest);
router.delete('/:id', withdrawalRequest_controller_1.WithdrawalRequestController.deleteWithdrawalRequest);
exports.WithdrawalRequestRoutes = router;
