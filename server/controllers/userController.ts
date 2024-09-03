import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Group from "../models/group";
import {
	FriendRequest,
	GroupRequest,
	GroupCreationRequest,
} from "../models/request";

// Get users
export const getUsers = async (req: Request, res: Response) => {
	try {
		// Get the current user's ID and admin status from the session
		const currentUserId = req.session.userId;
		const isAdmin = req.session.isAdmin;

		// Extract search params from the query
		const { name, status, page = 1, limit = 10 } = req.query;

		// Base query
		let query: any = {};

		if (!isAdmin) {
			// For regular users, exclude the current user and only include active users
			query = {
				_id: { $ne: currentUserId },
				status: "Active",
			};
		}

		// Apply additional filters
		if (name) {
			query.username = { $regex: name, $options: "i" }; // Case-insensitive search
		}

		if (status && isAdmin) {
			query.status = status; // Admins can filter by status
		}

		// Pagination
		const pageNumber = parseInt(page as string);
		const pageSize = parseInt(limit as string);
		const skip = (pageNumber - 1) * pageSize;

		// Execute the query
		const users = await User.find(query).skip(skip).limit(pageSize).exec();

		// Format the response
		const formattedUsers = users.map((user) => ({
			_id: user._id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			// @ts-ignore
			virtualProfileImage: user.virtualProfileImage,
			status: user.status
		}));

		// Return the users
		return res.status(200).json(formattedUsers);
	} catch (error) {
		console.error("Error retrieving users:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
	try {
		// Extract user ID from the request parameters
		const { id } = req.params;

		// Validate the ID format
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(id)
			.select("_id username displayName email profileImage")
			.lean();

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
				user.profileImage &&
				user.profileImage.contentType &&
				user.profileImage.data
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
		const user = await User.findById(id)
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
				friend.profileImage &&
				friend.profileImage.contentType &&
				friend.profileImage.data
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

// Get a user's friends recommendations by ID
export const getFriendRecommendationsById = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.params.id;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID and get their current friends
		const user = await User.findById(userId).select("friends").exec();

		// If the user is not found, return a 404 error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find users that the current user has sent friend requests to
		const sentRequests = await FriendRequest.find({ sender_id: userId })
			.select("receiver_id")
			.exec();
		const sentRequestIds = sentRequests.map((request) => request.receiver_id);

		// Find users who are not friends with the current user and haven't received a friend request from them
		let recommendations = await User.find({
			_id: {
				$ne: userId, // Exclude current user
				$nin: [...user.friends, ...sentRequestIds], // Exclude current friends and users who have received friend requests
			},
		})
			.select("_id username displayName email profileImage contentType") // Select necessary fields
			.exec();

		// Shuffle the array and select 10 random users
		recommendations = recommendations
			.sort(() => 0.5 - Math.random())
			.slice(0, 10);

		// Return the list of recommended friends, including virtualProfileImage
		return res.status(200).json(
			recommendations.map((user) => ({
				_id: user._id,
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				// @ts-ignore
				virtualProfileImage: user.virtualProfileImage,
			})),
		);
	} catch (error) {
		console.error("Error retrieving friend recommendations:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a user's groups by ID
export const getUserGroupsById = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find all groups where the user is a member or an admin
		const groups = await Group.find({
			$or: [{ members: userId }, { admins: userId }],
		})
			.select("name description visibility admins")
			.exec();

		// Format the response to include virtual fields
		const formattedGroups = groups.map((group) => ({
			id: group._id,
			name: group.name,
			description: group.description,
			visibility: group.visibility,
			admins: group.admins,
			// @ts-ignore
			virtualGroupImage: group.virtualGroupImage,
			// @ts-ignore
			virtualCoverImage: group.virtualCoverImage,
		}));

		// Return the list of groups
		return res.status(200).json(formattedGroups);
	} catch (error) {
		console.error("Error retrieving groups for user:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a user's notifications by ID
export const getUserNotificationsById = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID and get the notifications
		const user = await User.findById(userId).select("notifications").exec();

		// If the user is not found, return a 404 error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return the user's notifications
		return res.status(200).json(user.notifications);
	} catch (error) {
		console.error("Error retrieving user notifications:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get user's sent friend requests by ID
export const getUserSentFriendRequestsById = async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = req.params.id;
		const { status } = req.query;

		// Validate the user ID format
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Prepare query filters
		const filters: any = { sender_id: userId };
		if (status) {
			filters.status = status;
		}

		// Find all sent friend requests by the user
		const friendRequests = await FriendRequest.find(filters);

		// Return the user's sent friend requests
		return res.status(200).json(friendRequests);
	} catch (error) {
		console.error("Error retrieving user friend requests:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Read a notification by notification index
export const readNotification = async (req: Request, res: Response) => {
	try {
		const userId = req.session.userId;
		const notificationIndex = parseInt(req.params.notification_index);

		// Validate the user ID format
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the user by ID
		const user = await User.findById(userId);

		// If the user is not found, return a 404 error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the notification index is valid
		if (
			notificationIndex < 0 ||
			notificationIndex >= user.notifications.length
		) {
			return res.status(400).json({ message: "Invalid notification index" });
		}

		// Mark the notification as read
		user.notifications[notificationIndex].isRead = true;
		await user.save();

		// Return success response
		return res
			.status(200)
			.json({ message: "Notification marked as read successfully" });
	} catch (error) {
		console.error("Error marking notification as read:", error);
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
		if (
			!mongoose.Types.ObjectId.isValid(userId!) ||
			!mongoose.Types.ObjectId.isValid(friendId)
		) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Find the current user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Current user not found" });
		}

		// Check if the friend is in the current user's friend list
		const friendIndex = user.friends.indexOf(
			new mongoose.Types.ObjectId(friendId),
		);
		if (friendIndex === -1) {
			return res
				.status(404)
				.json({ message: "Friend not found in your friend list" });
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
		return res
			.status(200)
			.json({ message: "User account suspended successfully" });
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
			return res
				.status(400)
				.json({ message: "User account is already active" });
		}

		// Reactivate the user account
		user.status = "Active";
		await user.save();

		// Return success response
		return res
			.status(200)
			.json({ message: "User account reactivated successfully" });
	} catch (error) {
		console.error("Error reactivating user account:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
