import type { Request, Response } from "express";
import mongoose from "mongoose";
import { FriendRequest, GroupRequest, GroupCreationRequest } from "../models/request";
import Admin from "../models/admin";
import { User } from "../models/user";
import { Group } from "../models/group";

// Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
	try {
		// Fetch all types of requests in parallel
		const [friendRequests, groupRequests, groupCreationRequests] = await Promise.all([
			FriendRequest.find(),
			GroupRequest.find(),
			GroupCreationRequest.find(),
		]);

		// Combine all requests into a single response object
		const allRequests = {
			friendRequests,
			groupRequests,
			groupCreationRequests,
		};

		res.status(200).json(allRequests);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching requests", error: error.message });
	}
};

// ========== Friend Requests ==========
// Get an user's friend requests
export const getFriendRequests = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		// Check if the userId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find all friend requests where the user is either the sender or receiver
		const friendRequests = await FriendRequest.find({
			$or: [{ sender_id: userId }, { receiver_id: userId }],
		});

		res.status(200).json(friendRequests);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching friend requests", error: error.message });
	}
};

// Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
	try {
		const { sender_id, receiver_id } = req.body;

		// Check if the sender and receiver IDs are valid MongoDB ObjectIds
		if (!mongoose.Types.ObjectId.isValid(sender_id) || !mongoose.Types.ObjectId.isValid(receiver_id)) {
			return res.status(400).json({ message: "Invalid sender or receiver ID" });
		}

		// Check if the sender and receiver exist
		const sender = await User.findById(sender_id);
		const receiver = await User.findById(receiver_id);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}

		// Check if a friend request already exists between these users
		const existingRequest = await FriendRequest.findOne({
			sender_id,
			receiver_id,
			status: "Pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "Friend request already sent" });
		}

		// Create a new friend request
		const friendRequest = new FriendRequest({
			sender_id,
			receiver_id,
		});

		await friendRequest.save();

		// Update the receiver's notifications
		receiver.notifications.push({
			type: "User",
			message: `${sender.displayName} has sent you a friend request.`,
		});

		await receiver.save();

		res.status(201).json({ message: "Friend request sent successfully", friendRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error creating friend request", error: error.message });
	}
};

// Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the friend request by ID and check if it's still pending
		const friendRequest = await FriendRequest.findById(requestId);

		if (!friendRequest) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		if (friendRequest.status !== "Pending") {
			return res.status(400).json({ message: "Friend request is not pending" });
		}

		// Find both users (sender and receiver)
		const sender = await User.findById(friendRequest.sender_id);
		const receiver = await User.findById(friendRequest.receiver_id);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}

		// Update the friend request status to "Accepted"
		friendRequest.status = "Accepted";
		await friendRequest.save();

		// Add each user to the other's friends list
		sender.friends.push(receiver._id.toString());
		receiver.friends.push(sender._id.toString());

		await sender.save();
		await receiver.save();

		// Update the sender's notifications
		sender.notifications.push({
			type: "User",
			message: `${receiver.displayName} has accepted your friend request.`,
		});

		await sender.save();

		res.status(200).json({ message: "Friend request accepted successfully", friendRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error accepting friend request", error: error.message });
	}
};

// Reject friend request
export const rejectFriendRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the friend request by ID and check if it's still pending
		const friendRequest = await FriendRequest.findById(requestId);

		if (!friendRequest) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		if (friendRequest.status !== "Pending") {
			return res.status(400).json({ message: "Friend request is not pending" });
		}

		// Find the sender user
		const sender = await User.findById(friendRequest.sender_id);
		const receiver = await User.findById(friendRequest.receiver_id);

		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}

		// Update the friend request status to "Rejected"
		friendRequest.status = "Rejected";
		await friendRequest.save();

		// Update the sender's notifications
		sender.notifications.push({
			type: "User",
			message: `${receiver.displayName} has rejected your friend request.`,
		});

		await sender.save();

		res.status(200).json({ message: "Friend request rejected successfully", friendRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error rejecting friend request", error: error.message });
	}
};

// ========== Group Requests ==========
// Get a group's member requests
export const getGroupRequests = async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;

		// Check if the groupId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		// Find all member requests for the specified group
		const memberRequests = await GroupRequest.find({ group_id: groupId });

		if (memberRequests.length === 0) {
			return res.status(404).json({ message: "No member requests found for this group" });
		}

		res.status(200).json(memberRequests);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching member requests", error: error.message });
	}
};

// Send group member request
export const sendGroupRequest = async (req: Request, res: Response) => {
	try {
		const { user_id, group_id } = req.body;

		// Check if the groupId and user_id are valid MongoDB ObjectIds
		if (!mongoose.Types.ObjectId.isValid(group_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
			return res.status(400).json({ message: "Invalid group or user ID" });
		}

		// Find the group by ID
		const group = await Group.findById(group_id);
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Find the user by ID
		const user = await User.findById(user_id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if a group member request already exists for this user and group
		const existingRequest = await GroupRequest.findOne({
			user_id,
			group_id: group_id,
			status: "Pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "Group member request already sent" });
		}

		// Create a new group member request
		const groupRequest = new GroupRequest({
			user_id,
			group_id: group_id,
		});

		await groupRequest.save();

		// Update all of the group's admins with a notification
		const adminIds = group.admins;
		for (let adminId of adminIds) {
			const admin = await User.findById(adminId);
			if (admin) {
				admin.notifications.push({
					type: "Group",
					message: `${user.displayName} has requested to join the group "${group.name}".`,
				});
				await admin.save();
			}
		}

		res.status(201).json({ message: "Group member request sent successfully", groupRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error sending group member request", error: error.message });
	}
};

// Accept a group member request
export const acceptGroupRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the group member request by ID
		const groupRequest = await GroupRequest.findById(requestId);

		if (!groupRequest) {
			return res.status(404).json({ message: "Group member request not found" });
		}

		if (groupRequest.status !== "Pending") {
			return res.status(400).json({ message: "Group member request is not pending" });
		}

		// Find the group and user involved in the request
		const group = await Group.findById(groupRequest.group_id);
		const user = await User.findById(groupRequest.user_id);

		if (!group || !user) {
			return res.status(404).json({ message: "Group or user not found" });
		}

		// Update the group member request status to "Accepted"
		groupRequest.status = "Accepted";
		await groupRequest.save();

		// Add the user to the group's members list
		group.members.push(user._id.toString());
		await group.save();

		// Update the user's notifications
		user.notifications.push({
			type: "Group",
			message: `Your request to join the group "${group.name}" has been approved.`,
		});
		await user.save();

		// Notify all group admins
		const adminIds = group.admins;
		for (let adminId of adminIds) {
			const admin = await User.findById(adminId);
			if (admin) {
				admin.notifications.push({
					type: "Group",
					message: `${user.displayName} has been accepted to join the group "${group.name}".`,
				});
				await admin.save();
			}
		}

		res.status(200).json({ message: "Group member request accepted successfully", groupRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error accepting group member request", error: error.message });
	}
};

// Reject a group member request
export const rejectGroupRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the group member request by ID
		const groupRequest = await GroupRequest.findById(requestId);

		if (!groupRequest) {
			return res.status(404).json({ message: "Group member request not found" });
		}

		if (groupRequest.status !== "Pending") {
			return res.status(400).json({ message: "Group member request is not pending" });
		}

		// Find the group and user involved in the request
		const group = await Group.findById(groupRequest.group_id);
		const user = await User.findById(groupRequest.user_id);

		if (!group || !user) {
			return res.status(404).json({ message: "Group or user not found" });
		}

		// Update the group member request status to "Rejected"
		groupRequest.status = "Rejected";
		await groupRequest.save();

		// Update the user's notifications
		user.notifications.push({
			type: "Group",
			message: `Your request to join the group "${group.name}" has been rejected.`,
		});
		await user.save();

		// Notify all group admins
		const adminIds = group.admins;
		for (let adminId of adminIds) {
			const admin = await User.findById(adminId);
			if (admin) {
				admin.notifications.push({
					type: "Group",
					message: `${user.displayName}'s request to join the group "${group.name}" has been rejected.`,
				});
				await admin.save();
			}
		}

		res.status(200).json({ message: "Group member request rejected successfully", groupRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error rejecting group member request", error: error.message });
	}
};

// ========== Group Creation Requests ==========
// Get all group creation requests
export const getGroupCreationRequests = async (req: Request, res: Response) => {
	try {
		// Retrieve all group creation requests from the database
		const groupCreationRequests = await GroupCreationRequest.find();

		if (groupCreationRequests.length === 0) {
			return res.status(404).json({ message: "No group creation requests found" });
		}

		res.status(200).json(groupCreationRequests);
	} catch (error: any) {
		res.status(500).json({ message: "Error fetching group creation requests", error: error.message });
	}
};

// Send group creation request
export const sendGroupCreationRequest = async (req: Request, res: Response) => {
	try {
		const { senderId, group } = req.body;

		// Check if the senderId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(senderId)) {
			return res.status(400).json({ message: "Invalid sender ID" });
		}

		// Check if the user exists
		const user = await User.findById(senderId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Validate the group data
		const { name, description, visibility, groupImage, coverImage } = group;

		if (!name || !description || !visibility) {
			return res.status(400).json({ message: "Name, description, and visibility are required" });
		}

		// Create a new group creation request
		const groupCreationRequest = new GroupCreationRequest({
			user_id: senderId,
			group: {
				name,
				description,
				visibility,
				groupImage,
				coverImage,
				admins: [senderId], // Automatically set the sender as the admin
				members: [senderId], // Automatically add the sender as the first member
				posts: [],
			},
			status: "Pending",
		});

		await groupCreationRequest.save();

		res.status(201).json({ message: "Group creation request sent successfully", groupCreationRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error sending group creation request", error: error.message });
	}
};

// Accept group creation request
export const acceptGroupCreationRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the group creation request by ID
		const groupCreationRequest = await GroupCreationRequest.findById(requestId);

		if (!groupCreationRequest) {
			return res.status(404).json({ message: "Group creation request not found" });
		}

		if (groupCreationRequest.status !== "Pending") {
			return res.status(400).json({ message: "Group creation request is not pending" });
		}

		// Create the new group based on the request details
		const newGroup = new Group({
			name: groupCreationRequest.group?.name,
			description: groupCreationRequest.group?.description,
			visibility: groupCreationRequest.group?.visibility,
			groupImage: groupCreationRequest.group?.groupImage,
			coverImage: groupCreationRequest.group?.coverImage,
			admins: groupCreationRequest.group?.admins,
			members: groupCreationRequest.group?.members,
			posts: groupCreationRequest.group?.posts,
		});

		await newGroup.save();

		// Update the group creation request status to "Accepted"
		groupCreationRequest.status = "Accepted";
		await groupCreationRequest.save();

		// Notify the user who made the request
		const user = await User.findById(groupCreationRequest.user_id);
		if (user) {
			user.notifications.push({
				type: "Group",
				message: `Your request to create the group "${newGroup.name}" has been accepted.`,
			});
			await user.save();
		}

		res.status(200).json({
			message: "Group creation request accepted successfully",
			newGroup,
			groupCreationRequest,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Error accepting group creation request", error: error.message });
	}
};

// Reject group creation request
export const rejectGroupCreationRequest = async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params;

		// Check if the requestId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(requestId)) {
			return res.status(400).json({ message: "Invalid request ID" });
		}

		// Find the group creation request by ID
		const groupCreationRequest = await GroupCreationRequest.findById(requestId);

		if (!groupCreationRequest) {
			return res.status(404).json({ message: "Group creation request not found" });
		}

		if (groupCreationRequest.status !== "Pending") {
			return res.status(400).json({ message: "Group creation request is not pending" });
		}

		// Update the group creation request status to "Rejected"
		groupCreationRequest.status = "Rejected";
		await groupCreationRequest.save();

		// Notify the user who made the request
		const user = await User.findById(groupCreationRequest.user_id);
		if (user) {
			user.notifications.push({
				type: "Group",
				message: `Your request to create the group "${groupCreationRequest.group?.name}" has been rejected.`,
			});
			await user.save();
		}

		res.status(200).json({ message: "Group creation request rejected successfully", groupCreationRequest });
	} catch (error: any) {
		res.status(500).json({ message: "Error rejecting group creation request", error: error.message });
	}
};
