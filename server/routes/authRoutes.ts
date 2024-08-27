import express from "express";
import multer from "multer";
import { register, login, logout } from "../controllers/authController";
import fileUpload from "../middleware/fileUpload";

const authRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

authRouter.post("/register", fileUpload.single("profileImage"), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
