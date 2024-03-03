"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedFlippingRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const savedFlipping_controller_1 = require("./savedFlipping.controller");
const savedFlipping_validation_1 = require("./savedFlipping.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedFlipping_controller_1.SavedFlippingController.getAllSavedFlipping);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedFlipping_controller_1.SavedFlippingController.getSingleSavedFlipping);
router.post('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(savedFlipping_validation_1.SavedFlippingValidation.createValidation), savedFlipping_controller_1.SavedFlippingController.createSavedFlipping);
// router.patch(
//   '/:id',
//   auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
//   validateRequest(SavedFlippingValidation.updateValidation),
//   SavedFlippingController.updateSavedFlipping
// );
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedFlipping_controller_1.SavedFlippingController.deleteSavedFlipping);
exports.SavedFlippingRoutes = router;
