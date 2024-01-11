"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cart_controller_1 = require("./cart.controller");
const cart_validation_1 = require("./cart.validation");
const router = express_1.default.Router();
router.get('/', cart_controller_1.CartController.getAllCart);
router.get('/:id', cart_controller_1.CartController.getSingleCart);
router.post('/', (0, validateRequest_1.default)(cart_validation_1.CartValidation.createValidation), cart_controller_1.CartController.createCart);
router.patch('/:id', (0, validateRequest_1.default)(cart_validation_1.CartValidation.updateValidation), cart_controller_1.CartController.updateCart);
router.delete('/:id', cart_controller_1.CartController.deleteCart);
exports.CartRoutes = router;
