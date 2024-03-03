"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGroupRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const chatGroup_controller_1 = require("./chatGroup.controller");
const chatGroup_validation_1 = require("./chatGroup.validation");
const router = express_1.default.Router();
router.get('/', chatGroup_controller_1.ChatGroupController.getAllChatGroup);
router.get('/:id', chatGroup_controller_1.ChatGroupController.getSingleChatGroup);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(chatGroup_validation_1.ChatGroupValidation.createValidation), chatGroup_controller_1.ChatGroupController.createChatGroup);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(chatGroup_validation_1.ChatGroupValidation.updateValidation), chatGroup_controller_1.ChatGroupController.updateChatGroup);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), chatGroup_controller_1.ChatGroupController.deleteChatGroup);
exports.ChatGroupRoutes = router;
