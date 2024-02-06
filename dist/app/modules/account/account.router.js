"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const account_controller_1 = require("./account.controller");
const account_validation_1 = require("./account.validation");
const router = express_1.default.Router();
router.get('/', account_controller_1.AccountController.getAllAccount);
router.get('/:id', account_controller_1.AccountController.getSingleAccount);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(account_validation_1.AccountValidation.createValidation), account_controller_1.AccountController.createAccount);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(account_validation_1.AccountValidation.updateValidation), account_controller_1.AccountController.updateAccount);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.superAdmin), account_controller_1.AccountController.deleteAccount);
exports.AccountRoutes = router;
