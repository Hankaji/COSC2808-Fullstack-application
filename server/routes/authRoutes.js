"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const authRouter = express_1.default.Router();
authRouter.post('/register', fileUpload_1.default.single('profileImage'), authController_1.register);
authRouter.post('/login', authController_1.login);
authRouter.post('/logout', authController_1.logout);
exports.default = authRouter;
