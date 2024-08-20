import express from "express";

import { createUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/createUser", createUser);

export default userRouter;
