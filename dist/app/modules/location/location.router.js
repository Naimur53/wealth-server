"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const location_controller_1 = require("./location.controller");
const location_validation_1 = require("./location.validation");
const router = express_1.default.Router();
router.get('/', location_controller_1.LocationController.getAllLocation);
router.get('/:id', (0, validateRequest_1.default)(location_validation_1.LocationValidation.getSingleLocation), location_controller_1.LocationController.getSingleLocation);
router.post('/', (0, validateRequest_1.default)(location_validation_1.LocationValidation.createValidation), location_controller_1.LocationController.createLocation);
router.patch('/:id', (0, validateRequest_1.default)(location_validation_1.LocationValidation.updateValidation), location_controller_1.LocationController.updateLocation);
router.delete('/:id', location_controller_1.LocationController.deleteLocation);
exports.LocationRoutes = router;
