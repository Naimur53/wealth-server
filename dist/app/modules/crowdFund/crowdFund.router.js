"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrowdFundRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const crowdFund_controller_1 = require("./crowdFund.controller");
const crowdFund_validation_1 = require("./crowdFund.validation");
const router = express_1.default.Router();
router.get('/', crowdFund_controller_1.CrowdFundController.getAllCrowdFund);
router.get('/:id', crowdFund_controller_1.CrowdFundController.getSingleCrowdFund);
router.post('/', (0, validateRequest_1.default)(crowdFund_validation_1.CrowdFundValidation.createValidation), crowdFund_controller_1.CrowdFundController.createCrowdFund);
router.patch('/:id', (0, validateRequest_1.default)(crowdFund_validation_1.CrowdFundValidation.updateValidation), crowdFund_controller_1.CrowdFundController.updateCrowdFund);
router.delete('/:id', crowdFund_controller_1.CrowdFundController.deleteCrowdFund);
exports.CrowdFundRoutes = router;
