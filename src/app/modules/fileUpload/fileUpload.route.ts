import express from 'express';
import uploadImage from '../../middlewares/uploadImage';
import uploadVideo from '../../middlewares/uploadVideo';
import { fileUploadController } from './fileUpload.controller';

const router = express.Router();
router.post('/image', uploadImage, fileUploadController.uploadSingleFile);
router.post('/video', uploadVideo, fileUploadController.uploadSingleVideo);

export const fileUploadRoutes = router;
