import express from "express";
import {
	createUser,
	getUserById,
	getUsers,
	updateUser,
	suspendUser,
    reactivateUser,
	deleteUser,
	unfriendUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.put("/:id/suspend", suspendUser);
userRouter.put("/:id/reactivate", reactivateUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:userId/unfriend/:friendId", unfriendUser);

export default userRouter;
