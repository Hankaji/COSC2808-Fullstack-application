"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const requestController_1 = require("../controllers/requestController");
const requestRouter = express_1.default.Router();
// Friend requests
requestRouter.get('/friend_requests', authentication_1.isAuthenticated, requestController_1.getFriendRequests);
requestRouter.post('/friend_requests', authentication_1.isAuthenticated, requestController_1.createFriendRequest);
requestRouter.patch('/friend_requests/accept/:id', authentication_1.isAuthenticated, requestController_1.acceptFriendRequest);
requestRouter.patch('/friend_requests/reject/:id', authentication_1.isAuthenticated, requestController_1.rejectFriendRequest);
// Group requests
requestRouter.get('/group_requests', requestController_1.getGroupRequests);
requestRouter.post('/group_requests', requestController_1.createGroupRequest);
requestRouter.patch('/group_requests/accept/:id', requestController_1.acceptGroupRequest);
requestRouter.patch('/group_requests/reject/:id', requestController_1.rejectGroupRequest);
// Group creation requests
requestRouter.get('/group_creation_requests', authentication_1.isAuthenticated, authentication_1.isAdmin, requestController_1.getGroupCreationRequests);
requestRouter.post('/group_creation_requests', authentication_1.isAuthenticated, fileUpload_1.default.fields([
    { name: 'groupImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
]), requestController_1.createGroupCreationRequest);
requestRouter.patch('/group_creation_requests/accept/:id', authentication_1.isAuthenticated, authentication_1.isAdmin, requestController_1.acceptGroupCreationRequest);
requestRouter.patch('/group_creation_requests/reject/:id', authentication_1.isAuthenticated, authentication_1.isAdmin, requestController_1.rejectGroupCreationRequest);
exports.default = requestRouter;
