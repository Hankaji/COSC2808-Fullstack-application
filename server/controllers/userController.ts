import type { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user";

// Search for users
export const getUsers = async (req: Request, res: Response) => {
	try {
		const { name } = req.query;
		let users;
		let filter = {};

		if (name) {
			const nameRegex = new RegExp(name as string, "i");
			filter = {
				$or: [{ username: nameRegex }, { displayName: nameRegex }],
			};
			users = await User.find(filter).select("username displayName email profileImage status");
		} else {
			users = await User.find();
		}
		res.status(200).json(users);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching users", error: error.message });
	}
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching user", error: error.message });
	}
};

// Get a user by username
export const getUserByUsername = (username: string) =>
  User.findOne({ username });

// Create a new user
export const createUser = async (req: Request, res: Response) => {
	try {
		const { username, displayName, email, password, profileImage } = req.body;

		const user = new User({
			username,
			displayName,
			email,
			password,
			profileImage,
		});

		await user.save();
		res.status(201).json(user);
	} catch (error: any) {
		res.status(500).json({ message: "Error creating user", error: error.message });
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
			res.status(200).json({ message: "User updated successfully", updatedUser });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: "Error updating user", error: error.message });
	}
};

// Suspend a user by ID
export const suspendUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Check if the provided ID is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update the user's status to "Suspended"
		user.status = "Suspended";
		await user.save();

		res.status(200).json({ message: "User suspended successfully", user });
	} catch (error: any) {
		res.status(500).json({ message: "Error suspending user", error: error.message });
	}
};

// Reactivate a suspended user by ID
export const reactivateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Check if the provided ID is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update the user's status to "Active"
		user.status = "Active";
		await user.save();

		res.status(200).json({ message: "User reactivated successfully", user });
	} catch (error: any) {
		res.status(500).json({ message: "Error reactivating user", error: error.message });
	}
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully", id });
	} catch (error: any) {
		res.status(500).json({ message: "Error deleting user", error: error.message });
	}
};

// Unfriend another user
export const unfriendUser = async (req: Request, res: Response) => {
	try {
		const { userId, friendId } = req.params;

		// Check if both userId and friendId are valid MongoDB ObjectIds
		if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
			return res.status(400).json({ message: "Invalid user or friend ID" });
		}

		// Find the user who is making the unfriend request
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find the friend user who is being unfriended
		const friend = await User.findById(friendId);
		if (!friend) {
			return res.status(404).json({ message: "Friend not found" });
		}

		// Remove the friendId from the user's friends list
		user.friends = user.friends.filter((id) => id.toString() !== friendId);
		await user.save();

		// Remove the userId from the friend's friends list
		friend.friends = friend.friends.filter((id) => id.toString() !== userId);
		await friend.save();

		res.status(200).json({ message: "Successfully unfriended", user, friend });
	} catch (error: any) {
		res.status(500).json({ message: "Error unfriending user", error: error.message });
	}
};
