"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRequestRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const currencyRequest_controller_1 = require("./currencyRequest.controller");
const currencyRequest_validation_1 = require("./currencyRequest.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), currencyRequest_controller_1.CurrencyRequestController.getAllCurrencyRequest);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), currencyRequest_controller_1.CurrencyRequestController.getSingleCurrencyRequest);
router.post('/', (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.user), (0, validateRequest_1.default)(currencyRequest_validation_1.CurrencyRequestValidation.createValidation), currencyRequest_controller_1.CurrencyRequestController.createCurrencyRequest);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(currencyRequest_validation_1.CurrencyRequestValidation.updateValidation), currencyRequest_controller_1.CurrencyRequestController.updateCurrencyRequest);
router.delete('/:id', currencyRequest_controller_1.CurrencyRequestController.deleteCurrencyRequest);
exports.CurrencyRequestRoutes = router;
