"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faq_controller_1 = require("./faq.controller");
const faq_validation_1 = require("./faq.validation");
const router = express_1.default.Router();
router.get('/', faq_controller_1.FaqController.getAllFaq);
router.get('/:id', faq_controller_1.FaqController.getSingleFaq);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(faq_validation_1.FaqValidation.createValidation), faq_controller_1.FaqController.createFaq);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(faq_validation_1.FaqValidation.updateValidation), faq_controller_1.FaqController.updateFaq);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), faq_controller_1.FaqController.deleteFaq);
exports.FaqRoutes = router;
