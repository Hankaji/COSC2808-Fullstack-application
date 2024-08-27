import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/authentication";
import {
	getUsers,
	getUserFriends,
	getUserNotifications,
	getUserById,
	getUserFriendsById,
	unfriendById,
	suspendUser,
	resumeUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", isAuthenticated, getUsers);
userRouter.get("/friends", isAuthenticated, getUserFriends);
userRouter.get("/notifications", isAuthenticated, getUserNotifications);
userRouter.get("/:id", isAuthenticated, getUserById);
userRouter.get("/:id/friends", isAuthenticated, getUserFriendsById);
userRouter.delete("/unfriend/:id", isAuthenticated, unfriendById);
userRouter.patch("/suspend/:id", isAuthenticated, isAdmin, suspendUser);
userRouter.patch("/resume/:id", isAuthenticated, isAdmin, resumeUser);

export default userRouter;
