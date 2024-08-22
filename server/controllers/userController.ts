import type { Request, Response } from "express";
import { User } from "../models/user";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// get a user by username
export const getUserByUsername = (username: string) =>
  User.findOne({ username });
// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const user = new User({
    username: req.body.username,
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.username = req.body.username || user.username;
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.status = req.body.status || user.status;
      user.posts = req.body.posts || user.posts;
      user.friends = req.body.friends || user.friends;
      user.notifications = req.body.notifications || user.notifications;

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
