import express from "express";
import { users } from "../models/user";

export const getAllUsers = (req: express.Request, res: express.Response) => {
	res.json(users);
};
