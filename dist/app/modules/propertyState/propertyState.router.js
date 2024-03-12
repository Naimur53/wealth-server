"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStateRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const propertyState_controller_1 = require("./propertyState.controller");
const propertyState_validation_1 = require("./propertyState.validation");
const router = express_1.default.Router();
router.get('/', propertyState_controller_1.PropertyStateController.getAllPropertyState);
// router.get(
//   '/get-single-property-all-property-state',
//   validateRequest(PropertyStateValidation.getSingleAllPropertyState),
//   PropertyStateController.getSingleAllPropertyState
// );
router.get('/:id', propertyState_controller_1.PropertyStateController.getSinglePropertyState);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(propertyState_validation_1.PropertyStateValidation.createValidation), propertyState_controller_1.PropertyStateController.createPropertyState);
router.post('/multi-upload', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(propertyState_validation_1.PropertyStateValidation.createMultiValidation), propertyState_controller_1.PropertyStateController.createMultiPropertyState);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(propertyState_validation_1.PropertyStateValidation.updateValidation), propertyState_controller_1.PropertyStateController.updatePropertyState);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), propertyState_controller_1.PropertyStateController.deletePropertyState);
exports.PropertyStateRoutes = router;
