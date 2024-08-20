import type { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Adjust the import path as necessary

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, displayName, email, password, profileImage } = req.body;

        // Create a new user instance
        const newUser = new User({
            username,
            displayName,
            email,
            password,
            profileImage,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send a success response
        res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (error: any) {
        // Handle errors and send appropriate responses
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ message: "Username or email already exists" });
        } else {
            next(error);
        }
    }
};