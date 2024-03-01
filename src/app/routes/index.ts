import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BankRoutes } from '../modules/bank/bank.router';
import { ChatGroupRoutes } from '../modules/chatGroup/chatGroup.router';
import { CrowdFundRoutes } from '../modules/crowdFund/crowdFund.router';
import { FaqRoutes } from '../modules/faq/faq.router';
import { FeedbackRoutes } from '../modules/feedback/feedback.router';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { FlippingRoutes } from '../modules/flipping/flipping.router';
import { LocationRoutes } from '../modules/location/location.router';
import { MessageRoutes } from '../modules/message/message.router';
import { OrdersRoutes } from '../modules/orders/orders.router';
import { ProfileRoutes } from '../modules/profile/profile.router';
import { PromotionRoutes } from '../modules/promotion/promotion.router';
import { PropertyRoutes } from '../modules/property/property.router';
import { PropertyStateRoutes } from '../modules/propertyState/propertyState.router';
import { SavedCrowdFundRoutes } from '../modules/savedCrowdFund/savedCrowdFund.router';
import { SavedFlippingRoutes } from '../modules/savedFlipping/savedFlipping.router';
import { SavedPropertryRoutes } from '../modules/savedPropertry/savedPropertry.router';
import { SeenMessageRoutes } from '../modules/seenMessage/seenMessage.router';
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

  {
    path: '/property',
    route: PropertyRoutes,
  },

  {
    path: '/propertyState',
    route: PropertyStateRoutes,
  },

  {
    path: '/orders',
    route: OrdersRoutes,
  },

  {
    path: '/bank',
    route: BankRoutes,
  },

  {
    path: '/crowdFund',
    route: CrowdFundRoutes,
  },

  {
    path: '/savedCrowdFund',
    route: SavedCrowdFundRoutes,
  },

  {
    path: '/savedProperty',
    route: SavedPropertryRoutes,
  },

  {
    path: '/savedFlipping',
    route: SavedFlippingRoutes,
  },

  {
    path: '/flipping',
    route: FlippingRoutes,
  },

  {
    path: '/feedback',
    route: FeedbackRoutes,
  },

  {
    path: '/chatGroup',
    route: ChatGroupRoutes,
  },

  {
    path: '/message',
    route: MessageRoutes,
  },

  {
    path: '/seenMessage',
    route: SeenMessageRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: '/promotion',
    route: PromotionRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
