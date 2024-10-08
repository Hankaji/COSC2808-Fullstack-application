"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGroupMember = exports.getGroupMemberRequests = exports.getGroupMembers = exports.getGroupAdmins = exports.getGroupById = exports.getGroups = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const group_1 = __importDefault(require("../models/group"));
const user_1 = __importDefault(require("../models/user"));
const request_1 = require("../models/request");
// Get all groups
const getGroups = async (req, res) => {
    try {
        const currentUserId = req.session.userId;
        const { name } = req.query;
        // Build the query object based on the search parameters
        let query = {};
        if (name) {
            // Use a regular expression for case-insensitive partial matching on the group name
            query.name = new RegExp(name, 'i');
        }
        // Find groups with the query, and apply pagination
        const groups = await group_1.default.find(query)
            .select('_id name description visibility groupImage coverImage admins members')
            .populate('admins', '_id username displayName')
            .populate('members', '_id username displayName')
            .lean();
        // Find any pending group requests for the current user
        const pendingGroupRequests = await request_1.GroupRequest.find({
            user_id: currentUserId,
            status: 'Pending',
        })
            .select('group_id')
            .lean();
        // Extract group_ids from pending requests
        const pendingGroupIds = pendingGroupRequests.map((request) => request.group_id.toString());
        // Add virtualGroupImage, virtualCoverImage, and relationship to each group
        const groupsWithImagesAndRelationship = groups.map((group) => {
            // Determine the relationship status
            let relationship = 'Stranger';
            if (group.admins.some((admin) => admin._id.toString() == currentUserId?.toString())) {
                relationship = 'Admin';
            }
            // Check if the current user is a member of the group
            else if (group.members.some((member) => member._id.toString() == currentUserId?.toString())) {
                relationship = 'Member';
            }
            // Check if the current user has a pending request
            else if (pendingGroupIds.includes(group._id.toString())) {
                relationship = 'Pending';
            }
            // Return the group data with virtual images and relationship
            return {
                _id: group._id,
                name: group.name,
                description: group.description,
                visibility: group.visibility,
                virtualGroupImage: group.groupImage &&
                    group.groupImage.contentType &&
                    group.groupImage.data
                    ? `data:${group.groupImage.contentType};base64,${group.groupImage.data.toString('base64')}`
                    : undefined,
                virtualCoverImage: group.coverImage &&
                    group.coverImage.contentType &&
                    group.coverImage.data
                    ? `data:${group.coverImage.contentType};base64,${group.coverImage.data.toString('base64')}`
                    : undefined,
                admins: group.admins,
                members: group.members,
                relationship,
            };
        });
        // Return the groups with the relationship field
        return res.status(200).json(groupsWithImagesAndRelationship);
    }
    catch (error) {
        console.error('Error retrieving groups:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroups = getGroups;
// Get a group by ID
const getGroupById = async (req, res) => {
    try {
        const groupId = req.params.id;
        const currentUserId = req.session.userId;
        // Validate the group ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }
        // Find the group by ID
        const group = await group_1.default.findById(groupId)
            .select('_id name description visibility groupImage coverImage admins members')
            .populate('admins', '_id username displayName')
            .populate('members', '_id username displayName')
            .lean();
        // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Find any pending group requests for the current user
        const pendingGroupRequest = await request_1.GroupRequest.findOne({
            user_id: currentUserId,
            group_id: groupId,
            status: 'Pending',
        }).lean();
        // Determine the relationship status
        let relationship = 'Stranger';
        // Check if the current user is a member of the group
        if (group.admins.some((admin) => admin._id.toString() == currentUserId?.toString())) {
            relationship = 'Admin';
        }
        else if (group.members.some((member) => member._id.toString() == currentUserId?.toString())) {
            relationship = 'Member';
        }
        else if (pendingGroupRequest) {
            relationship = 'Pending';
        }
        // Add virtualGroupImage, virtualCoverImage, and relationship to the group
        const groupWithImagesAndRelationship = {
            _id: group._id,
            name: group.name,
            description: group.description,
            visibility: group.visibility,
            virtualGroupImage: group.groupImage &&
                group.groupImage.contentType &&
                group.groupImage.data
                ? `data:${group.groupImage.contentType};base64,${group.groupImage.data.toString('base64')}`
                : undefined,
            virtualCoverImage: group.coverImage &&
                group.coverImage.contentType &&
                group.coverImage.data
                ? `data:${group.coverImage.contentType};base64,${group.coverImage.data.toString('base64')}`
                : undefined,
            admins: group.admins,
            members: group.members,
            relationship,
        };
        // Return the group
        return res.status(200).json(groupWithImagesAndRelationship);
    }
    catch (error) {
        console.error('Error retrieving group:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupById = getGroupById;
// Get a group's admins by ID
const getGroupAdmins = async (req, res) => {
    try {
        // Extract the group ID from the request parameters
        const groupId = req.params.id;
        // Validate the group ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }
        // Find the group by ID and populate the admins array
        const group = await group_1.default.findById(groupId)
            .populate({
            path: 'admins',
            select: '_id username displayName email profileImage',
            model: user_1.default,
        })
            .lean();
        // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Extract the admins list and add virtualProfileImage to each admin
        const admins = group.admins.map((admin) => ({
            _id: admin._id,
            username: admin.username,
            displayName: admin.displayName,
            email: admin.email,
            virtualProfileImage: admin.profileImage &&
                admin.profileImage.contentType &&
                admin.profileImage.data
                ? `data:${admin.profileImage.contentType};base64,${admin.profileImage.data.toString('base64')}`
                : undefined,
        }));
        // Return the admins list
        return res.status(200).json(admins);
    }
    catch (error) {
        console.error('Error retrieving group admins:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupAdmins = getGroupAdmins;
// Get a group's members by ID
const getGroupMembers = async (req, res) => {
    try {
        // Extract the group ID from the request parameters
        const groupId = req.params.id;
        // Validate the group ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }
        // Find the group by ID and populate the members array
        const group = await group_1.default.findById(groupId)
            .populate({
            path: 'members',
            select: '_id username displayName email profileImage',
            model: user_1.default,
        })
            .lean();
        // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Extract the members list and add virtualProfileImage to each member
        const members = group.members.map((member) => ({
            _id: member._id,
            username: member.username,
            displayName: member.displayName,
            email: member.email,
            virtualProfileImage: member.profileImage &&
                member.profileImage.contentType &&
                member.profileImage.data
                ? `data:${member.profileImage.contentType};base64,${member.profileImage.data.toString('base64')}`
                : undefined,
        }));
        // Return the members list
        return res.status(200).json(members);
    }
    catch (error) {
        console.error('Error retrieving group members:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupMembers = getGroupMembers;
// Get a group's member requests by ID
const getGroupMemberRequests = async (req, res) => {
    try {
        const groupId = req.params.id;
        const currentUserId = req.session.userId;
        const isAdmin = req.session.isAdmin;
        // Validate the group ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }
        // Check if the group exists
        const group = await group_1.default.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Check if the current user is an admin or the group's admin
        const isGroupAdmin = group.admins.some((adminId) => adminId.equals(currentUserId));
        if (!isAdmin && !isGroupAdmin) {
            return res.status(403).json({
                message: "You are not authorized to view this group's requests",
            });
        }
        // Find pending group member requests by group_id
        const groupRequests = await request_1.GroupRequest.find({
            group_id: groupId,
            status: 'Pending',
        })
            .select('_id user_id createdAt status')
            .populate({
            path: 'user_id',
            select: '_id username displayName profileImage contentType',
        })
            .exec();
        // Process the user information and virtualProfileImage manually
        const processedRequests = groupRequests.map((request) => {
            const user = request.user_id;
            // Manually create the virtualProfileImage
            const virtualProfileImage = user.profileImage && user.profileImage.data
                ? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`
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
    }
    catch (error) {
        console.error('Error retrieving group member requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupMemberRequests = getGroupMemberRequests;
// Remove a member from a group by ID
const removeGroupMember = async (req, res) => {
    try {
        // Extract groupId and userId from the request parameters
        const { groupId, userId } = req.params;
        const currentUserId = req.session.userId;
        // Validate groupId and userId formats
        if (!mongoose_1.default.Types.ObjectId.isValid(groupId) ||
            !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid group ID or user ID' });
        }
        // Find the group by ID
        const group = await group_1.default.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Check if the current user is an admin of the group
        if (!group.admins.includes(currentUserId)) {
            return res
                .status(403)
                .json({ message: 'Only group admins can remove members' });
        }
        // Check if the user to be removed is a member of the group
        const memberIndex = group.members.findIndex((memberId) => memberId.equals(userId));
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'User not found in the group' });
        }
        // Remove the member from the group
        group.members.splice(memberIndex, 1);
        await group.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Member removed from group successfully' });
    }
    catch (error) {
        console.error('Error removing member from group:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.removeGroupMember = removeGroupMember;
