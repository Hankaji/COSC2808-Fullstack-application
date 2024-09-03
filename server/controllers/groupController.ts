import type { Request, Response } from "express";
import mongoose from "mongoose";
import Group from "../models/group";
import User from "../models/user";
import { GroupRequest } from "../models/request";

// Get all groups
export const getGroups = async (req: Request, res: Response) => {
	try {
		const { name, page = 1, limit = 10 } = req.query;

		// Build the query object based on the search parameters
		let query: any = {};

		if (name) {
			// Use a regular expression for case-insensitive partial matching on the group name
			query.name = new RegExp(name as string, "i");
		}

		// Convert page and limit to numbers
		const pageNumber = parseInt(page as string) || 1;
		const limitNumber = parseInt(limit as string) || 10;
		const skip = (pageNumber - 1) * limitNumber;

		// Find groups with the query, and apply pagination
		const groups = await Group.find(query)
			.select(
				"_id name description visibility groupImage coverImage admins members",
			)
			.skip(skip)
			.limit(limitNumber)
			.populate("admins", "_id username displayName")
			.populate("members", "_id username displayName")
			.lean();

		// Add virtualGroupImage and virtualCoverImage to each group
		const groupsWithImages = groups.map((group) => ({
			_id: group._id,
			name: group.name,
			description: group.description,
			visibility: group.visibility,
			virtualGroupImage:
				group.groupImage &&
				group.groupImage.contentType &&
				group.groupImage.data
					? `data:${group.groupImage.contentType};base64,${group.groupImage.data.toString("base64")}`
					: undefined,
			virtualCoverImage:
				group.coverImage &&
				group.coverImage.contentType &&
				group.coverImage.data
					? `data:${group.coverImage.contentType};base64,${group.coverImage.data.toString("base64")}`
					: undefined,
			admins: group.admins,
			members: group.members,
		}));

		// Return the groups
		return res.status(200).json(groupsWithImages);
	} catch (error) {
		console.error("Error retrieving groups:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a group by ID
export const getGroupById = async (req: Request, res: Response) => {
	try {
		// Extract the group ID from the request parameters
		const groupId = req.params.id;

		// Validate the group ID format
		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		// Find the group by ID
		const group = await Group.findById(groupId)
			.select(
				"_id name description visibility groupImage coverImage admins members",
			)
			.populate("admins", "_id username displayName")
			.populate("members", "_id username displayName")
			.lean();

		// Check if the group exists
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Add virtualGroupImage and virtualCoverImage to the group
		const groupWithImages = {
			_id: group._id,
			name: group.name,
			description: group.description,
			visibility: group.visibility,
			virtualGroupImage:
				group.groupImage &&
				group.groupImage.contentType &&
				group.groupImage.data
					? `data:${group.groupImage.contentType};base64,${group.groupImage.data.toString("base64")}`
					: undefined,
			virtualCoverImage:
				group.coverImage &&
				group.coverImage.contentType &&
				group.coverImage.data
					? `data:${group.coverImage.contentType};base64,${group.coverImage.data.toString("base64")}`
					: undefined,
			admins: group.admins,
			members: group.members,
		};

		// Return the group
		return res.status(200).json(groupWithImages);
	} catch (error) {
		console.error("Error retrieving group:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a group's admins by ID
export const getGroupAdmins = async (req: Request, res: Response) => {
	try {
		// Extract the group ID from the request parameters
		const groupId = req.params.id;

		// Validate the group ID format
		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		// Find the group by ID and populate the admins array
		const group = await Group.findById(groupId)
			.populate({
				path: "admins",
				select: "_id username displayName email profileImage",
				model: User,
			})
			.lean();

		// Check if the group exists
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Extract the admins list and add virtualProfileImage to each admin
		const admins = group.admins.map((admin: any) => ({
			_id: admin._id,
			username: admin.username,
			displayName: admin.displayName,
			email: admin.email,
			virtualProfileImage:
				admin.profileImage &&
				admin.profileImage.contentType &&
				admin.profileImage.data
					? `data:${admin.profileImage.contentType};base64,${admin.profileImage.data.toString("base64")}`
					: undefined,
		}));

		// Return the admins list
		return res.status(200).json(admins);
	} catch (error) {
		console.error("Error retrieving group admins:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a group's members by ID
export const getGroupMembers = async (req: Request, res: Response) => {
	try {
		// Extract the group ID from the request parameters
		const groupId = req.params.id;

		// Validate the group ID format
		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		// Find the group by ID and populate the members array
		const group = await Group.findById(groupId)
			.populate({
				path: "members",
				select: "_id username displayName email profileImage",
				model: User,
			})
			.lean();

		// Check if the group exists
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Extract the members list and add virtualProfileImage to each member
		const members = group.members.map((member: any) => ({
			_id: member._id,
			username: member.username,
			displayName: member.displayName,
			email: member.email,
			virtualProfileImage:
				member.profileImage &&
				member.profileImage.contentType &&
				member.profileImage.data
					? `data:${member.profileImage.contentType};base64,${member.profileImage.data.toString("base64")}`
					: undefined,
		}));

		// Return the members list
		return res.status(200).json(members);
	} catch (error) {
		console.error("Error retrieving group members:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Get a group's member requests by ID
export const getGroupMemberRequests = async (req: Request, res: Response) => {
	try {
		const groupId = req.params.id;
		const currentUserId = req.session.userId;
		const isAdmin = req.session.isAdmin;

		// Validate the group ID format
		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			return res.status(400).json({ message: "Invalid group ID" });
		}

		// Check if the group exists
		const group = await Group.findById(groupId);
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Check if the current user is an admin or the group's admin
		const isGroupAdmin = group.admins.some((adminId) =>
			adminId.equals(currentUserId),
		);
		if (!isAdmin && !isGroupAdmin) {
			return res
				.status(403)
				.json({
					message: "You are not authorized to view this group's requests",
				});
		}

		// Find pending group member requests by group_id
		const groupRequests = await GroupRequest.find({
			group_id: groupId,
			status: "Pending",
		})
			.select("_id user_id createdAt status")
			.populate({
				path: "user_id",
				select: "_id username displayName profileImage contentType",
			})
			.exec();

		// Process the user information and virtualProfileImage manually
		const processedRequests = groupRequests.map((request) => {
			const user = request.user_id as any;

			// Manually create the virtualProfileImage
			const virtualProfileImage =
				user.profileImage && user.profileImage.data
					? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString("base64")}`
					: null;

			return {
				id: request._id,
				user: {
					_id: user._id,
					username: user.username,
					displayName: user.displayName,
					virtualProfileImage,
				},
				createdAt: request.createdAt,
				status: request.status,
			};
		});

		// Return the processed pending requests
		return res.status(200).json(processedRequests);
	} catch (error) {
		console.error("Error retrieving group member requests:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

// Remove a member from a group by ID
export const removeGroupMember = async (req: Request, res: Response) => {
	try {
		// Extract groupId and userId from the request parameters
		const { groupId, userId } = req.params;
		const currentUserId = req.session.userId;

		// Validate groupId and userId formats
		if (
			!mongoose.Types.ObjectId.isValid(groupId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			return res.status(400).json({ message: "Invalid group ID or user ID" });
		}

		// Find the group by ID
		const group = await Group.findById(groupId);
		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		// Check if the current user is an admin of the group
		if (!group.admins.includes(currentUserId as mongoose.Types.ObjectId)) {
			return res
				.status(403)
				.json({ message: "Only group admins can remove members" });
		}

		// Check if the user to be removed is a member of the group
		const memberIndex = group.members.findIndex(
			(memberId: mongoose.Types.ObjectId) => memberId.equals(userId),
		);
		if (memberIndex === -1) {
			return res.status(404).json({ message: "User not found in the group" });
		}

		// Remove the member from the group
		group.members.splice(memberIndex, 1);
		await group.save();

		// Return success response
		return res
			.status(200)
			.json({ message: "Member removed from group successfully" });
	} catch (error) {
		console.error("Error removing member from group:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
