import express from "express";
import {
	getAllRequests,
	getFriendRequests,
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	getGroupRequests,
	sendGroupRequest,
	acceptGroupRequest,
	rejectGroupRequest,
	getGroupCreationRequests,
	sendGroupCreationRequest,
	acceptGroupCreationRequest,
	rejectGroupCreationRequest,
} from "../controllers/requestController";

const requestRouter = express.Router();

requestRouter.get("/", getAllRequests);

// Friend requests
requestRouter.get("/friend_requests/:userId", getFriendRequests);
requestRouter.post("/friend_requests", sendFriendRequest);
requestRouter.put("/friend_requests/accept/:requestId", acceptFriendRequest);
requestRouter.put("/friend_requests/reject/:requestId", rejectFriendRequest);

// Group requests
requestRouter.get("/group_requests/:groupId", getGroupRequests);
requestRouter.post("/group_requests", sendGroupRequest);
requestRouter.put("/group_requests/accept/:requestId", acceptGroupRequest);
requestRouter.put("/group_requests/reject/:requestId", rejectGroupRequest);

// Group creation requests
requestRouter.get("/group_creation_requests", getGroupCreationRequests);
requestRouter.post("/group_creation_requests", sendGroupCreationRequest);
requestRouter.put("/group_creation_requests/accept/:requestId", acceptGroupCreationRequest);
requestRouter.put("/group_creation_requests/reject/:requestId", rejectGroupCreationRequest);

export default requestRouter;
