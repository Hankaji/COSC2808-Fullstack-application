import type { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user";

// Get all users / Get current user
export const getUsers = async (req: Request, res: Response) => {
	try {
		const { name, status, page = 1, limit = 10 } = req.query;
		const isAdmin = req.session.isAdmin;
		const userId = req.session.userId;

		if (isAdmin) {
			// Admin: Get all users with optional search and pagination
			let query: any = {};

			if (name) {
				query.$or = [
					{ username: new RegExp(name as string, "i") },
					{ displayName: new RegExp(name as string, "i") },
				];
			}

			if (status) {
				query.status = status;
			}

			const pageNumber = parseInt(page as string) || 1;
			const limitNumber = parseInt(limit as string) || 10;
			const skip = (pageNumber - 1) * limitNumber;

			const users = await User.find(query)
				.select("_id username displayName email profileImage")
				.skip(skip)
				.limit(limitNumber)
				.lean();

			return res.status(200).json({
				page: pageNumber,
				limit: limitNumber,
				totalUsers: users.length,
				users: users.map((user) => ({
					_id: user._id,
					username: user.username,
					displayName: user.displayName,
					email: user.email,
					virtualProfileImage:
						user.profileImage && user.profileImage.contentType && user.profileImage.data
							? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString(
									"base64"
							  )}`
							: undefined,
				})),
			});
		} else {
			// User: Get only their own data
			if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
				return res.status(400).json({ message: "Invalid user ID" });
			}

			const user = await User.findById(userId).select("_id username displayName email profileImage").lean();

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(200).json({
				_id: user._id,
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				virtualProfileImage:
					user.profileImage && user.profileImage.contentType && user.profileImage.data
						? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString("base64")}`
						: undefined,
			});
		}
	} catch (error) {
		console.error("Error retrieving users:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get the current user's friends
export const getUserFriends = async (req: Request, res: Response) => {
	try {
		// Get the current user's ID from the session
		const userId = req.session.userId;

		// Validate the user ID format
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID and populate the friends array
		const user = await User.findById(userId)
			.populate("friends", "_id username displayName email profileImage")
			.lean();

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Extract the friends list and add virtualProfileImage to each friend
		const friends = user.friends.map((friend: any) => ({
			_id: friend._id,
			username: friend.username,
			displayName: friend.displayName,
			email: friend.email,
			virtualProfileImage:
				friend.profileImage && friend.profileImage.contentType && friend.profileImage.data
					? `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString("base64")}`
					: undefined,
		}));

		// Return the friends list
		return res.status(200).json(friends);
	} catch (error) {
		console.error("Error retrieving user's friends:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get the current user's notifications
export const getUserNotifications = async (req: Request, res: Response) => {
	try {
		// Get the current user's ID from the session
		const userId = req.session.userId;

		// Validate the user ID format
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID and select only the notifications array
		const user = await User.findById(userId).select("notifications").lean();

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return the user's notifications
		return res.status(200).json(user.notifications);
	} catch (error) {
		console.error("Error retrieving user's notifications:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
	try {
		// Extract user ID from the request parameters
		const { id } = req.params;

		// Validate the ID format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(id).select("_id username displayName email profileImage").lean(); // Using lean() for faster read-only queries

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Add virtualProfileImage to the user
		const userWithProfileImage = {
			_id: user._id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			virtualProfileImage:
				user.profileImage && user.profileImage.contentType && user.profileImage.data
					? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString("base64")}`
					: undefined,
		};

		// Return the user
		return res.status(200).json(userWithProfileImage);
	} catch (error) {
		console.error("Error retrieving user:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a user's friends by ID
export const getUserFriendsById = async (req: Request, res: Response) => {
	try {
		// Extract user ID from the request parameters
		const { id } = req.params;

		// Validate the ID format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID and populate the friends array
		const user = await User.findById(id).populate("friends", "_id username displayName email profileImage").lean();

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Extract the friends list and add virtualProfileImage to each friend
		const friends = user.friends.map((friend: any) => ({
			_id: friend._id,
			username: friend.username,
			displayName: friend.displayName,
			email: friend.email,
			virtualProfileImage:
				friend.profileImage && friend.profileImage.contentType && friend.profileImage.data
					? `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString("base64")}`
					: undefined,
		}));

		// Return the friends list
		return res.status(200).json(friends);
	} catch (error) {
		console.error("Error retrieving user's friends:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Unfriend a user by ID
export const unfriendById = async (req: Request, res: Response) => {
	try {
		// Get the current user's ID from the session and the friend's ID from the request parameters
		const userId = req.session.userId;
		const friendId = req.params.id;

		// Validate both user IDs
		if (!mongoose.Types.ObjectId.isValid(userId!) || !mongoose.Types.ObjectId.isValid(friendId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the current user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Current user not found" });
		}

		// Check if the friend is in the current user's friend list
		const friendIndex = user.friends.indexOf(new mongoose.Types.ObjectId(friendId));
		if (friendIndex === -1) {
			return res.status(404).json({ message: "Friend not found in your friend list" });
		}

		// Remove the friend from the current user's friend list
		user.friends.splice(friendIndex, 1);
		await user.save();

		// Remove the current user from the friend's friend list
		const friend = await User.findById(friendId);
		if (friend) {
			const userIndex = friend.friends.indexOf(userId!);
			if (userIndex !== -1) {
				friend.friends.splice(userIndex, 1);
				await friend.save();
			}
		}

		// Return success response
		return res.status(200).json({ message: "User unfriended successfully" });
	} catch (error) {
		console.error("Error unfriending user:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Suspend a user by ID
export const suspendUser = async (req: Request, res: Response) => {
	try {
		// Get the user's ID from the request parameters
		const userId = req.params.id;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Suspend the user account
		user.status = "Suspended";
		await user.save();

		// Return success response
		return res.status(200).json({ message: "User account suspended successfully" });
	} catch (error) {
		console.error("Error suspending user account:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Resume a suspended user by ID
export const resumeUser = async (req: Request, res: Response) => {
	try {
		// Get the user's ID from the request parameters
		const userId = req.params.id;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the user is already active
		if (user.status === "Active") {
			return res.status(400).json({ message: "User account is already active" });
		}

		// Reactivate the user account
		user.status = "Active";
		await user.save();

		// Return success response
		return res.status(200).json({ message: "User account reactivated successfully" });
	} catch (error) {
		console.error("Error reactivating user account:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
