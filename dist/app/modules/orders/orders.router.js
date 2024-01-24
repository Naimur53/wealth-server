"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const orders_controller_1 = require("./orders.controller");
const orders_validation_1 = require("./orders.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin), orders_controller_1.OrdersController.getAllOrders);
router.get('/my-orders', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), orders_controller_1.OrdersController.getMyOrders);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.user), orders_controller_1.OrdersController.getSingleOrders);
router.post('/', (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.user, client_1.UserRole.admin), (0, validateRequest_1.default)(orders_validation_1.OrdersValidation.createValidation), orders_controller_1.OrdersController.createOrders);
// router.patch(
//   '/:id',
//   auth(UserRole.admin),
//   validateRequest(OrdersValidation.updateValidation),
//   OrdersController.updateOrders
// );
// router.delete('/:id', OrdersController.deleteOrders);
exports.OrdersRoutes = router;
