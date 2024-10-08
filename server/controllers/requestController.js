"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectGroupCreationRequest = exports.acceptGroupCreationRequest = exports.createGroupCreationRequest = exports.getGroupCreationRequests = exports.rejectGroupRequest = exports.acceptGroupRequest = exports.createGroupRequest = exports.getGroupRequests = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.createFriendRequest = exports.getFriendRequests = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const request_1 = require("../models/request");
const user_1 = require("../models/user");
const group_1 = require("../models/group");
// ========== Friend Requests ==========
// Get the current user's friend requests
const getFriendRequests = async (req, res) => {
    try {
        // Get the current user's ID from the session
        const userId = req.session.userId;
        // Validate the user ID format
        if (userId && !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find all pending friend requests where the current user is the receiver
        const pendingRequests = await request_1.FriendRequest.find({
            receiver_id: userId,
            status: 'Pending',
        }).lean();
        // Return the list of pending friend requests
        return res.status(200).json(pendingRequests);
    }
    catch (error) {
        console.error('Error retrieving pending friend requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFriendRequests = getFriendRequests;
// Create friend request
const createFriendRequest = async (req, res) => {
    try {
        // Get the current user's ID from the session
        const senderId = req.session.userId;
        // Extract the receiver_id from the request body
        const { receiver_id } = req.body;
        // Validate the user ID formats
        if (!senderId ||
            !receiver_id ||
            !mongoose_1.default.Types.ObjectId.isValid(senderId) ||
            !mongoose_1.default.Types.ObjectId.isValid(receiver_id)) {
            return res.status(400).json({ message: 'Invalid sender or receiver ID' });
        }
        // Check if the sender exists and get their displayName
        const sender = await user_1.User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        // Check if the receiver exists
        const receiver = await user_1.User.findById(receiver_id);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        // Check if a friend request already exists between these two users
        const existingRequest = await request_1.FriendRequest.findOne({
            sender_id: senderId,
            receiver_id: receiver_id,
            status: 'Pending',
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }
        // Create a new friend request
        const friendRequest = new request_1.FriendRequest({
            sender_id: senderId,
            receiver_id: receiver_id,
            status: 'Pending',
        });
        await friendRequest.save();
        // Add a notification to the receiver's notifications array
        const notificationMessage = `${sender.displayName} has sent you a friend request.`;
        receiver.notifications.push({
            type: 'User',
            message: notificationMessage,
            isRead: false,
            createdAt: new Date(),
        });
        await receiver.save();
        // Return success response
        return res
            .status(201)
            .json({ message: 'Friend request sent successfully' });
    }
    catch (error) {
        console.error('Error creating friend request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createFriendRequest = createFriendRequest;
// Accept friend request
const acceptFriendRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the friend request by ID
        const friendRequest = await request_1.FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        // Check if the current user is the receiver of the friend request
        if (friendRequest.receiver_id != req.session.userId) {
            return res
                .status(403)
                .json({
                message: 'You are not authorized to accept this friend request',
            });
        }
        // Update the status of the friend request to "Accepted"
        friendRequest.status = 'Accepted';
        await friendRequest.save();
        // Add the sender to the receiver's friends list
        const receiver = await user_1.User.findById(friendRequest.receiver_id);
        const sender = await user_1.User.findById(friendRequest.sender_id);
        if (!receiver || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }
        receiver.friends.push(sender._id);
        sender.friends.push(receiver._id);
        await receiver.save();
        await sender.save();
        // Add a notification to the sender's notifications array
        sender.notifications.push({
            type: 'User',
            message: `${receiver.displayName} has accepted your friend request.`,
            isRead: false,
            createdAt: new Date(),
        });
        await sender.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Friend request accepted successfully' });
    }
    catch (error) {
        console.error('Error accepting friend request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.acceptFriendRequest = acceptFriendRequest;
// Reject friend request
const rejectFriendRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the friend request by ID
        const friendRequest = await request_1.FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        // Check if the current user is the receiver of the friend request
        if (friendRequest.receiver_id != req.session.userId) {
            return res
                .status(403)
                .json({
                message: 'You are not authorized to reject this friend request',
            });
        }
        // Update the status of the friend request to "Rejected"
        friendRequest.status = 'Rejected';
        await friendRequest.save();
        // Fetch the receiver's information
        const receiver = await user_1.User.findById(req.session.userId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        // Add a notification to the sender's notifications array
        const sender = await user_1.User.findById(friendRequest.sender_id);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        sender.notifications.push({
            type: 'User',
            message: `${receiver.displayName} has rejected your friend request.`,
            isRead: false,
            createdAt: new Date(),
        });
        await sender.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Friend request rejected successfully' });
    }
    catch (error) {
        console.error('Error rejecting friend request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.rejectFriendRequest = rejectFriendRequest;
// ========== Group Requests ==========
// Get a group's member requests where the current user is an admin
const getGroupRequests = async (req, res) => {
    try {
        // Get the current user's ID from the session
        const userId = req.session.userId;
        // Validate the user ID format
        if (userId && !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find all groups where the current user is an admin
        const groups = await group_1.Group.find({ admins: userId }).select('_id').lean();
        const groupIds = groups.map((group) => group._id);
        // Find all pending group requests for these groups
        const pendingRequests = await request_1.GroupRequest.find({
            group_id: { $in: groupIds },
            status: 'Pending',
        }).lean();
        // Return the list of pending group requests
        return res.status(200).json(pendingRequests);
    }
    catch (error) {
        console.error('Error retrieving pending group requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupRequests = getGroupRequests;
// Create group member request
const createGroupRequest = async (req, res) => {
    try {
        // Get the current user's ID from the session
        const senderId = req.session.userId;
        const { group_id } = req.body;
        // Validate the user ID and group ID formats
        if (!senderId ||
            !group_id ||
            !mongoose_1.default.Types.ObjectId.isValid(senderId) ||
            !mongoose_1.default.Types.ObjectId.isValid(group_id)) {
            return res.status(400).json({ message: 'Invalid sender or group ID' });
        }
        // Check if the group exists
        const group = await group_1.Group.findById(group_id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Check if a group request already exists for this user and group
        const existingRequest = await request_1.GroupRequest.findOne({
            user_id: senderId,
            group_id: group_id,
            status: 'Pending',
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'Group request already sent' });
        }
        // Create a new group request
        const groupRequest = new request_1.GroupRequest({
            user_id: senderId,
            group_id: group_id,
            status: 'Pending',
        });
        await groupRequest.save();
        // Send notifications to all group admins
        const sender = await user_1.User.findById(senderId).select('displayName');
        for (const adminId of group.admins) {
            const admin = await user_1.User.findById(adminId);
            if (admin) {
                admin.notifications.push({
                    type: 'Group',
                    message: `${sender.displayName} has requested to join the group "${group.name}".`,
                    isRead: false,
                    createdAt: new Date(),
                });
                await admin.save();
            }
        }
        // Return success response
        return res.status(201).json({ message: 'Group request sent successfully' });
    }
    catch (error) {
        console.error('Error creating group request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createGroupRequest = createGroupRequest;
// Accept a group member request
const acceptGroupRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        const currentUserId = req.session.userId;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the group request by ID
        const groupRequest = await request_1.GroupRequest.findById(requestId);
        if (!groupRequest) {
            return res.status(404).json({ message: 'Group request not found' });
        }
        // Find the group associated with the request
        const group = await group_1.Group.findById(groupRequest.group_id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Check if the current user is an admin of the group
        if (!group.admins.includes(currentUserId)) {
            return res
                .status(403)
                .json({
                message: 'You are not authorized to accept this group request',
            });
        }
        // Update the status of the group request to "Accepted"
        groupRequest.status = 'Accepted';
        await groupRequest.save();
        // Add the requester to the group's members list
        group.members.push(groupRequest.user_id);
        await group.save();
        // Add a notification to the requester's notifications array
        const requester = await user_1.User.findById(groupRequest.user_id);
        if (!requester) {
            return res.status(404).json({ message: 'Requester not found' });
        }
        requester.notifications.push({
            type: 'Group',
            message: `Your request to join the group "${group.name}" has been accepted.`,
            isRead: false,
            createdAt: new Date(),
        });
        await requester.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Group request accepted successfully' });
    }
    catch (error) {
        console.error('Error accepting group request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.acceptGroupRequest = acceptGroupRequest;
// Reject a group member request
const rejectGroupRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        const currentUserId = req.session.userId;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the group request by ID
        const groupRequest = await request_1.GroupRequest.findById(requestId);
        if (!groupRequest) {
            return res.status(404).json({ message: 'Group request not found' });
        }
        // Find the group associated with the request
        const group = await group_1.Group.findById(groupRequest.group_id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Check if the current user is an admin of the group
        if (!group.admins.includes(currentUserId)) {
            return res
                .status(403)
                .json({
                message: 'You are not authorized to reject this group request',
            });
        }
        // Update the status of the group request to "Rejected"
        groupRequest.status = 'Rejected';
        await groupRequest.save();
        // Add a notification to the requester's notifications array
        const requester = await user_1.User.findById(groupRequest.user_id);
        if (!requester) {
            return res.status(404).json({ message: 'Requester not found' });
        }
        requester.notifications.push({
            type: 'Group',
            message: `Your request to join the group "${group.name}" has been rejected.`,
            isRead: false,
            createdAt: new Date(),
        });
        await requester.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Group request rejected successfully' });
    }
    catch (error) {
        console.error('Error rejecting group request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.rejectGroupRequest = rejectGroupRequest;
// ========== Group Creation Requests ==========
// Get all group creation requests
const getGroupCreationRequests = async (req, res) => {
    try {
        // Find all pending group creation requests
        const pendingRequests = await request_1.GroupCreationRequest.find({
            status: 'Pending',
        })
            .select('_id user_id createdAt status group')
            .exec();
        // Format the response to include virtual fields
        const formattedRequests = pendingRequests.map((request) => ({
            _id: request._id,
            user_id: request.user_id, // This will include populated user details if populated
            createdAt: request.createdAt,
            status: request.status,
            group: {
                name: request.group.name,
                description: request.group.description,
                visibility: request.group.visibility,
                // @ts-ignore
                virtualGroupImage: request.virtualGroupImage,
                // @ts-ignore
                virtualCoverImage: request.virtualCoverImage,
            },
        }));
        // Return the list of pending group creation requests
        return res.status(200).json(formattedRequests);
    }
    catch (error) {
        console.error('Error retrieving group creation requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGroupCreationRequests = getGroupCreationRequests;
// Create group creation request
const createGroupCreationRequest = async (req, res) => {
    try {
        // Get the current user's ID from the session
        const userId = req.session.userId;
        // Validate the user ID format
        if (userId && !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Validate the input fields
        const { name, description, visibility } = req.body;
        if (!name || !description || !visibility) {
            return res
                .status(400)
                .json({ message: 'Name, description, and visibility are required' });
        }
        // Check visibility enum
        if (!['Public', 'Private'].includes(visibility)) {
            return res
                .status(400)
                .json({ message: "Visibility must be either 'Public' or 'Private'" });
        }
        // Handle file uploads safely
        const groupImage = req.files && 'groupImage' in req.files
            ? req.files['groupImage'][0]
            : null;
        const coverImage = req.files && 'coverImage' in req.files
            ? req.files['coverImage'][0]
            : null;
        // Create a new group creation request
        const groupCreationRequest = new request_1.GroupCreationRequest({
            user_id: userId,
            group: {
                name,
                description,
                visibility,
                groupImage: groupImage
                    ? {
                        data: groupImage.buffer,
                        contentType: groupImage.mimetype,
                    }
                    : undefined,
                coverImage: coverImage
                    ? {
                        data: coverImage.buffer,
                        contentType: coverImage.mimetype,
                    }
                    : undefined,
                admins: [userId],
                members: [userId],
                posts: [],
            },
            status: 'Pending',
        });
        // Save the group creation request to the database
        await groupCreationRequest.save();
        // Return success response
        return res
            .status(201)
            .json({ message: 'Group creation request submitted successfully' });
    }
    catch (error) {
        console.error('Error creating group creation request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createGroupCreationRequest = createGroupCreationRequest;
// Accept group creation request
const acceptGroupCreationRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the group creation request by ID
        const groupCreationRequest = await request_1.GroupCreationRequest.findById(requestId);
        if (!groupCreationRequest) {
            return res
                .status(404)
                .json({ message: 'Group creation request not found' });
        }
        // Update the status of the group creation request to "Accepted"
        groupCreationRequest.status = 'Accepted';
        await groupCreationRequest.save();
        // Create the group using the data from the group creation request
        const newGroup = new group_1.Group({
            name: groupCreationRequest.group.name,
            description: groupCreationRequest.group.description,
            visibility: groupCreationRequest.group.visibility,
            groupImage: groupCreationRequest.group.groupImage,
            coverImage: groupCreationRequest.group.coverImage,
            admins: groupCreationRequest.group.admins,
            members: groupCreationRequest.group.members,
        });
        await newGroup.save();
        // Send a notification to the user who sent the request
        const user = await user_1.User.findById(groupCreationRequest.user_id);
        if (user) {
            user.notifications.push({
                type: 'Group',
                message: `Your group creation request for "${newGroup.name}" has been accepted.`,
                isRead: false,
                createdAt: new Date(),
            });
            await user.save();
        }
        // Return success response
        return res
            .status(200)
            .json({
            message: 'Group creation request accepted successfully',
            groupId: newGroup._id,
        });
    }
    catch (error) {
        console.error('Error accepting group creation request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.acceptGroupCreationRequest = acceptGroupCreationRequest;
// Reject group creation request
const rejectGroupCreationRequest = async (req, res) => {
    try {
        // Get the request ID from the request parameters
        const requestId = req.params.id;
        // Validate the request ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        // Find the group creation request by ID
        const groupCreationRequest = await request_1.GroupCreationRequest.findById(requestId);
        if (!groupCreationRequest) {
            return res
                .status(404)
                .json({ message: 'Group creation request not found' });
        }
        // Update the status of the group creation request to "Rejected"
        groupCreationRequest.status = 'Rejected';
        await groupCreationRequest.save();
        // Send a notification to the user who sent the request
        const user = await user_1.User.findById(groupCreationRequest.user_id);
        if (user) {
            user.notifications.push({
                type: 'Group',
                message: `Your group creation request for "${groupCreationRequest.group.name}" has been rejected.`,
                isRead: false,
                createdAt: new Date(),
            });
            await user.save();
        }
        // Return success response
        return res
            .status(200)
            .json({ message: 'Group creation request rejected successfully' });
    }
    catch (error) {
        console.error('Error rejecting group creation request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.rejectGroupCreationRequest = rejectGroupCreationRequest;
