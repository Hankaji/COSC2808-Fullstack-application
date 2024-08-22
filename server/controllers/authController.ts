import bcrypt from "bcrypt";
import { User } from "../models/user";
import { getUserById, getUserByUsername } from "./userController";
import { json, type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = new User({
    username: req.body.username,
    displayName: req.body.displayName,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // const user = await getUserById(username).select("+password");
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    const { password: _, ...userData } = user.toObject();
    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
