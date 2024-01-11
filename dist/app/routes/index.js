"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_router_1 = require("../modules/account/account.router");
const auth_route_1 = require("../modules/auth/auth.route");
const cart_router_1 = require("../modules/cart/cart.router");
const orders_router_1 = require("../modules/orders/orders.router");
const express_1 = __importDefault(require("express"));
const profile_router_1 = require("../modules/profile/profile.router");
const user_router_1 = require("../modules/user/user.router");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_router_1.UserRoutes,
    },
    {
        path: '/profile',
        route: profile_router_1.ProfileRoutes,
    },
    {
        path: '/accounts',
        route: account_router_1.AccountRoutes,
    },
    {
        path: '/orders',
        route: orders_router_1.OrdersRoutes,
    },
    {
        path: '/cart',
        route: cart_router_1.CartRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
