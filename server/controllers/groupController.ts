import type { Request, Response, NextFunction } from "express";
import Group from "../models/group"; // Adjust the import path as necessary

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, visibility, groupImage, admins, members, posts } = req.body;

        // Create a new group instance
        const newGroup = new Group({
            name,
            description,
            visibility,
            groupImage,
            admins,
            members,
            posts,
        });

        // Save the group to the database
        const savedGroup = await newGroup.save();

        // Send a success response
        res.status(201).json({ message: "Group created successfully", group: savedGroup });
    } catch (error: any) {
        // Handle errors and send appropriate responses
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ message: "Group name already exists" });
        } else {
            next(error);
        }
    }
};