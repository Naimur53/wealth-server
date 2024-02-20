import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { LocationRoutes } from '../modules/location/location.router';
import { ProfileRoutes } from '../modules/profile/profile.router';
import { UserRoutes } from '../modules/user/user.router';
const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/location',
    route: LocationRoutes,
  },
  {
    path: '/uploadImg',
    route: fileUploadRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
