import express from "express";
import { register, login } from "../controllers/authController";
import multer from "multer";
const authRouter = express.Router();
var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

authRouter.post("/register", upload.single("profileImage"), register);
authRouter.post("/login", login);
// authRouter.get("/user/:username/profileImage", getProfilePic);

export default authRouter;
