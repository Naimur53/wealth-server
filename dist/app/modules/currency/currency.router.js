"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const currency_controller_1 = require("./currency.controller");
const currency_validation_1 = require("./currency.validation");
const router = express_1.default.Router();
router.get('/', currency_controller_1.CurrencyController.getAllCurrency);
router.get('/single-user-currency', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), currency_controller_1.CurrencyController.getSingleCurrencyByUserId);
// router.get('/:id', CurrencyController.getSingleCurrency);
router.post('/', (0, validateRequest_1.default)(currency_validation_1.CurrencyValidation.createValidation), currency_controller_1.CurrencyController.createCurrency);
// router.patch(
//   '/:id',
//   validateRequest(CurrencyValidation.updateValidation),
//   CurrencyController.updateCurrency
// );
// router.delete('/:id', CurrencyController.deleteCurrency);
exports.CurrencyRoutes = router;
