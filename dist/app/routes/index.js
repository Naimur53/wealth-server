"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const bank_router_1 = require("../modules/bank/bank.router");
const chatGroup_router_1 = require("../modules/chatGroup/chatGroup.router");
const crowdFund_router_1 = require("../modules/crowdFund/crowdFund.router");
const faq_router_1 = require("../modules/faq/faq.router");
const feedback_router_1 = require("../modules/feedback/feedback.router");
const fileUpload_route_1 = require("../modules/fileUpload/fileUpload.route");
const flipping_router_1 = require("../modules/flipping/flipping.router");
const location_router_1 = require("../modules/location/location.router");
const message_router_1 = require("../modules/message/message.router");
const orders_router_1 = require("../modules/orders/orders.router");
const profile_router_1 = require("../modules/profile/profile.router");
const promotion_router_1 = require("../modules/promotion/promotion.router");
const property_router_1 = require("../modules/property/property.router");
const propertyState_router_1 = require("../modules/propertyState/propertyState.router");
const savedCrowdFund_router_1 = require("../modules/savedCrowdFund/savedCrowdFund.router");
const savedFlipping_router_1 = require("../modules/savedFlipping/savedFlipping.router");
const savedPropertry_router_1 = require("../modules/savedPropertry/savedPropertry.router");
const seenMessage_router_1 = require("../modules/seenMessage/seenMessage.router");
const user_router_1 = require("../modules/user/user.router");
const webhook_router_1 = require("../modules/webhook/webhook.router");
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
        path: '/location',
        route: location_router_1.LocationRoutes,
    },
    {
        path: '/uploadImg',
        route: fileUpload_route_1.fileUploadRoutes,
    },
    {
        path: '/property',
        route: property_router_1.PropertyRoutes,
    },
    {
        path: '/propertyState',
        route: propertyState_router_1.PropertyStateRoutes,
    },
    {
        path: '/orders',
        route: orders_router_1.OrdersRoutes,
    },
    {
        path: '/bank',
        route: bank_router_1.BankRoutes,
    },
    {
        path: '/crowdFund',
        route: crowdFund_router_1.CrowdFundRoutes,
    },
    {
        path: '/savedCrowdFund',
        route: savedCrowdFund_router_1.SavedCrowdFundRoutes,
    },
    {
        path: '/savedProperty',
        route: savedPropertry_router_1.SavedPropertryRoutes,
    },
    {
        path: '/savedFlipping',
        route: savedFlipping_router_1.SavedFlippingRoutes,
    },
    {
        path: '/flipping',
        route: flipping_router_1.FlippingRoutes,
    },
    {
        path: '/feedback',
        route: feedback_router_1.FeedbackRoutes,
    },
    {
        path: '/chatGroup',
        route: chatGroup_router_1.ChatGroupRoutes,
    },
    {
        path: '/message',
        route: message_router_1.MessageRoutes,
    },
    {
        path: '/seenMessage',
        route: seenMessage_router_1.SeenMessageRoutes,
    },
    {
        path: '/faq',
        route: faq_router_1.FaqRoutes,
    },
    {
        path: '/promotion',
        route: promotion_router_1.PromotionRoutes,
    },
    {
        path: '/image-upload',
        route: fileUpload_route_1.fileUploadRoutes,
    },
    {
        path: '/webhook',
        route: webhook_router_1.WebHookRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
