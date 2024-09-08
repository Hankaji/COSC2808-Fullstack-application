"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const groupController_1 = require("../controllers/groupController");
const groupRouter = express_1.default.Router();
groupRouter.get('/', authentication_1.isAuthenticated, groupController_1.getGroups);
groupRouter.get('/:id', authentication_1.isAuthenticated, groupController_1.getGroupById);
groupRouter.get('/:id/admins', authentication_1.isAuthenticated, groupController_1.getGroupAdmins);
groupRouter.get('/:id/members', authentication_1.isAuthenticated, groupController_1.getGroupMembers);
groupRouter.get('/:id/requests', authentication_1.isAuthenticated, groupController_1.getGroupMemberRequests);
groupRouter.delete('/:groupId/members/:userId', authentication_1.isAuthenticated, groupController_1.removeGroupMember);
exports.default = groupRouter;
