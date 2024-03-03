"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPropertryRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const savedPropertry_controller_1 = require("./savedPropertry.controller");
const savedPropertry_validation_1 = require("./savedPropertry.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedPropertry_controller_1.SavedPropertryController.getAllSavedPropertry);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedPropertry_controller_1.SavedPropertryController.getSingleSavedPropertry);
router.post('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(savedPropertry_validation_1.SavedPropertryValidation.createValidation), savedPropertry_controller_1.SavedPropertryController.createSavedPropertry);
// router.patch(
//   '/:id',
//   validateRequest(SavedPropertryValidation.updateValidation),
//   SavedPropertryController.updateSavedPropertry
// );
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedPropertry_controller_1.SavedPropertryController.deleteSavedPropertry);
exports.SavedPropertryRoutes = router;
