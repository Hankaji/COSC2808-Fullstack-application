import express from "express";
import { isAuthenticated } from "../middleware/authentication";
import {
	getGroups,
	getGroupById,
	getGroupAdmins,
	getGroupMembers,
	removeGroupMember,
} from "../controllers/groupController";

const groupRouter = express.Router();

groupRouter.get("/", isAuthenticated, getGroups);
groupRouter.get("/:id", isAuthenticated, getGroupById);
groupRouter.get("/:id/admins", isAuthenticated, getGroupAdmins);
groupRouter.get("/:id/members", isAuthenticated, getGroupMembers);
groupRouter.delete("/:groupId/members/:userId", isAuthenticated, removeGroupMember);

export default groupRouter;
