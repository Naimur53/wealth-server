"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const promotion_controller_1 = require("./promotion.controller");
const promotion_validation_1 = require("./promotion.validation");
const router = express_1.default.Router();
router.get('/', 
// auth(UserRole.admin, UserRole.superAdmin),
promotion_controller_1.PromotionController.getAllPromotion);
router.get('/:id', promotion_controller_1.PromotionController.getSinglePromotion);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(promotion_validation_1.PromotionValidation.createValidation), promotion_controller_1.PromotionController.createPromotion);
router.post('/add-interest', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user), (0, validateRequest_1.default)(promotion_validation_1.PromotionValidation.addInterestValidation), promotion_controller_1.PromotionController.addInterestInPromotion);
router.post('/remove-interest', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user), (0, validateRequest_1.default)(promotion_validation_1.PromotionValidation.addInterestValidation), promotion_controller_1.PromotionController.removeInterestInPromotion);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(promotion_validation_1.PromotionValidation.updateValidation), promotion_controller_1.PromotionController.updatePromotion);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), promotion_controller_1.PromotionController.deletePromotion);
exports.PromotionRoutes = router;
