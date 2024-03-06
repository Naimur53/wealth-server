"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = __importDefault(require("../../middlewares/uploadImage"));
const uploadVideo_1 = __importDefault(require("../../middlewares/uploadVideo"));
const fileUpload_controller_1 = require("./fileUpload.controller");
const router = express_1.default.Router();
router.post('/image', uploadImage_1.default, fileUpload_controller_1.fileUploadController.uploadSingleFile);
router.post('/video', uploadVideo_1.default, fileUpload_controller_1.fileUploadController.uploadSingleVideo);
exports.fileUploadRoutes = router;
