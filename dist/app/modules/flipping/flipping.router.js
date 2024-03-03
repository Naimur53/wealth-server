"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlippingRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flipping_controller_1 = require("./flipping.controller");
const flipping_validation_1 = require("./flipping.validation");
const router = express_1.default.Router();
router.get('/', flipping_controller_1.FlippingController.getAllFlipping);
router.get('/:id', flipping_controller_1.FlippingController.getSingleFlipping);
router.post('/', (0, auth_1.default)(client_1.UserRole.user), (0, validateRequest_1.default)(flipping_validation_1.FlippingValidation.createValidation), flipping_controller_1.FlippingController.createFlipping);
router.patch('/:id', (0, validateRequest_1.default)(flipping_validation_1.FlippingValidation.updateValidation), flipping_controller_1.FlippingController.updateFlipping);
router.delete('/:id', flipping_controller_1.FlippingController.deleteFlipping);
exports.FlippingRoutes = router;
