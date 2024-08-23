import express from "express";
import {
	getUsers,
	getUserById,
	getUserFriends,
	getCurrentUserProfile,
	getCurrentUserNotifications,
	createUser,
	updateUser,
	suspendUser,
	reactivateUser,
	deleteUser,
	unfriendUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/:id/friends", getUserFriends);
userRouter.get("/current/profile", getCurrentUserProfile);
userRouter.get("/current/notifications", getCurrentUserNotifications);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.put("/:id/suspend", suspendUser);
userRouter.put("/:id/reactivate", reactivateUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:userId/unfriend/:friendId", unfriendUser);

export default userRouter;
