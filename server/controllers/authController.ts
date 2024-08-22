import bcrypt from "bcrypt";
import { User } from "../models/user";
import type { Request, Response } from "express";

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
