"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const property_controller_1 = require("./property.controller");
const property_validation_1 = require("./property.validation");
const router = express_1.default.Router();
router.get('/', property_controller_1.PropertyController.getAllProperty);
router.get('/:id', property_controller_1.PropertyController.getSingleProperty);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(property_validation_1.PropertyValidation.createValidation), property_controller_1.PropertyController.createProperty);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(property_validation_1.PropertyValidation.updateValidation), property_controller_1.PropertyController.updateProperty);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), property_controller_1.PropertyController.deleteProperty);
exports.PropertyRoutes = router;
