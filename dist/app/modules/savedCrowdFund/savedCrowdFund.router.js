"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedCrowdFundRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const savedCrowdFund_controller_1 = require("./savedCrowdFund.controller");
const savedCrowdFund_validation_1 = require("./savedCrowdFund.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedCrowdFund_controller_1.SavedCrowdFundController.getAllSavedCrowdFund);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedCrowdFund_controller_1.SavedCrowdFundController.getSingleSavedCrowdFund);
router.post('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(savedCrowdFund_validation_1.SavedCrowdFundValidation.createValidation), savedCrowdFund_controller_1.SavedCrowdFundController.createSavedCrowdFund);
// router.patch(
//   '/:id',
//   auth(UserRole.user, UserRole.admin, UserRole.superAdmin),
//   validateRequest(SavedCrowdFundValidation.updateValidation),
//   SavedCrowdFundController.updateSavedCrowdFund
// );
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.superAdmin), savedCrowdFund_controller_1.SavedCrowdFundController.deleteSavedCrowdFund);
exports.SavedCrowdFundRoutes = router;
