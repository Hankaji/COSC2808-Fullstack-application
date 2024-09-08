"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeUser = exports.suspendUser = exports.unfriendById = exports.readNotification = exports.getUserSentFriendRequestsById = exports.getUserNotificationsById = exports.getUserGroupsById = exports.getFriendRecommendationsById = exports.getUserFriendsById = exports.getUserById = exports.getUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const group_1 = __importDefault(require("../models/group"));
const request_1 = require("../models/request");
// Get users
const getUsers = async (req, res) => {
    try {
        // Get the current user's ID and admin status from the session
        const currentUserId = req.session.userId;
        const isAdmin = req.session.isAdmin;
        // Extract search params from the query
        const { name, status } = req.query;
        // Base query
        let query = {};
        if (!isAdmin) {
            // For regular users, exclude the current user and only include active users
            query = {
                _id: { $ne: currentUserId },
                status: 'Active',
            };
        }
        // Apply additional filters
        if (name) {
            // Match either username or displayName
            query.$or = [
                { username: { $regex: name, $options: 'i' } },
                { displayName: { $regex: name, $options: 'i' } },
            ];
        }
        if (status && isAdmin) {
            query.status = status; // Admins can filter by status
        }
        // Pagination
        // Execute the query
        const users = await user_1.default.find(query).exec();
        // Find the current user's friend list
        const currentUser = await user_1.default.findById(currentUserId)
            .select('friends')
            .exec();
        // Get all friend requests involving the current user (sent or received)
        const friendRequests = await request_1.FriendRequest.find({
            $or: [
                { sender_id: currentUserId, status: 'Pending' },
                { receiver_id: currentUserId, status: 'Pending' },
            ],
        }).exec();
        // Format the response
        const formattedUsers = users.map((user) => {
            // Determine the relationship with the current user
            let relationship = 'Stranger';
            // Check if the user is a friend
            if (currentUser?.friends.includes(user._id)) {
                relationship = 'Friend';
            }
            else {
                // Check if there is a pending friend request
                const hasPendingRequest = friendRequests.some((request) => {
                    return ((request.sender_id.equals(currentUserId) &&
                        request.receiver_id.equals(user._id)) ||
                        (request.sender_id.equals(user._id) &&
                            request.receiver_id.equals(currentUserId)));
                });
                if (hasPendingRequest) {
                    relationship = 'Pending';
                }
            }
            return {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                // @ts-ignore
                virtualProfileImage: user.virtualProfileImage,
                status: user.status,
                relationship,
            };
        });
        // Return the users
        return res.status(200).json(formattedUsers);
    }
    catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
// Get a user by ID
const getUserById = async (req, res) => {
    try {
        // Extract user ID from the request parameters
        const { id } = req.params;
        const currentUserId = req.session.userId;
        // Validate the ID format
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID
        const user = await user_1.default.findById(id)
            .select('_id username createdAt status displayName email profileImage friends')
            .lean();
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get the current user's friend list
        const currentUser = await user_1.default.findById(currentUserId)
            .select('friends')
            .exec();
        // Find any pending friend requests involving the current user
        const friendRequests = await request_1.FriendRequest.find({
            $or: [
                { sender_id: currentUserId, receiver_id: id, status: 'Pending' },
                { receiver_id: currentUserId, sender_id: id, status: 'Pending' },
            ],
        }).exec();
        // Determine the relationship
        let relationship = 'Stranger';
        if (currentUser?.friends.includes(user._id)) {
            relationship = 'Friend';
        }
        else if (friendRequests.length > 0) {
            relationship = 'Pending';
        }
        // Create the user details object
        const userFullDetails = {
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            virtualProfileImage: user.profileImage &&
                user.profileImage.contentType &&
                user.profileImage.data
                ? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString('base64')}`
                : undefined,
            createAt: user.createdAt,
            updatedAt: user.updatedAt,
            relationship, // Include the relationship status
        };
        // Return the user with relationship status
        return res.status(200).json(userFullDetails);
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserById = getUserById;
// Get a user's friends by ID
const getUserFriendsById = async (req, res) => {
    try {
        // Extract user ID from the request parameters
        const { id } = req.params;
        // Validate the ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID and populate the friends array
        const user = await user_1.default.findById(id)
            .populate('friends', '_id username displayName email profileImage')
            .lean();
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Extract the friends list and add virtualProfileImage to each friend
        const friends = user.friends.map((friend) => ({
            _id: friend._id,
            username: friend.username,
            displayName: friend.displayName,
            email: friend.email,
            virtualProfileImage: friend.profileImage &&
                friend.profileImage.contentType &&
                friend.profileImage.data
                ? `data:${friend.profileImage.contentType};base64,${friend.profileImage.data.toString('base64')}`
                : undefined,
        }));
        // Return the friends list
        return res.status(200).json(friends);
    }
    catch (error) {
        console.error("Error retrieving user's friends:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserFriendsById = getUserFriendsById;
// Get a user's friends recommendations by ID
const getFriendRecommendationsById = async (req, res) => {
    try {
        const userId = req.params.id;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID and get their current friends
        const user = await user_1.default.findById(userId).select('friends').exec();
        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find users that the current user has sent friend requests to
        const sentRequests = await request_1.FriendRequest.find({ sender_id: userId })
            .select('receiver_id')
            .exec();
        const sentRequestIds = sentRequests.map((request) => request.receiver_id);
        // Find users who are not friends with the current user and haven't received a friend request from them
        let recommendations = await user_1.default.find({
            _id: {
                $ne: userId, // Exclude current user
                $nin: [...user.friends, ...sentRequestIds], // Exclude current friends and users who have received friend requests
            },
        })
            .select('_id username displayName email profileImage contentType') // Select necessary fields
            .exec();
        // Shuffle the array and select 10 random users
        recommendations = recommendations
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
        // Return the list of recommended friends, including virtualProfileImage
        return res.status(200).json(recommendations.map((user) => ({
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            // @ts-ignore
            virtualProfileImage: user.virtualProfileImage,
        })));
    }
    catch (error) {
        console.error('Error retrieving friend recommendations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFriendRecommendationsById = getFriendRecommendationsById;
// Get a user's groups by ID
const getUserGroupsById = async (req, res) => {
    try {
        const userId = req.params.id;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find all groups where the user is a member or an admin
        const groups = await group_1.default.find({
            $or: [{ members: userId }, { admins: userId }],
        })
            .select('name description visibility admins groupImage')
            .exec();
        // Format the response to include virtual fields
        const formattedGroups = groups.map((group) => ({
            id: group._id,
            name: group.name,
            description: group.description,
            visibility: group.visibility,
            admins: group.admins,
            // @ts-ignore
            virtualGroupImage: group.groupImage &&
                group.groupImage.contentType &&
                group.groupImage.data
                ? `data:${group.groupImage.contentType};base64,${group.groupImage.data.toString('base64')}`
                : undefined,
        }));
        // Return the list of groups
        return res.status(200).json(formattedGroups);
    }
    catch (error) {
        console.error('Error retrieving groups for user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserGroupsById = getUserGroupsById;
// Get a user's notifications by ID
const getUserNotificationsById = async (req, res) => {
    try {
        const userId = req.params.id;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID and get the notifications
        const user = await user_1.default.findById(userId).select('notifications').exec();
        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the user's notifications
        return res.status(200).json(user.notifications);
    }
    catch (error) {
        console.error('Error retrieving user notifications:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserNotificationsById = getUserNotificationsById;
// Get user's sent friend requests by ID
const getUserSentFriendRequestsById = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.query;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Prepare query filters
        const filters = { sender_id: userId };
        if (status) {
            filters.status = status;
        }
        // Find all sent friend requests by the user
        const friendRequests = await request_1.FriendRequest.find(filters);
        // Return the user's sent friend requests
        return res.status(200).json(friendRequests);
    }
    catch (error) {
        console.error('Error retrieving user friend requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserSentFriendRequestsById = getUserSentFriendRequestsById;
// Read a notification by notification index
const readNotification = async (req, res) => {
    try {
        const userId = req.session.userId;
        const notificationId = req.params.notificationId;
        // Validate the user ID format
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID
        const user = await user_1.default.findById(userId);
        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let foundNotification = false;
        for (const item of user.notifications) {
            if (notificationId === item.id) {
                item.isRead = true;
                foundNotification = true;
                break;
            }
        }
        if (!foundNotification) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }
        await user.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'Notification marked as read successfully' });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.readNotification = readNotification;
// Unfriend a user by ID
const unfriendById = async (req, res) => {
    try {
        // Get the current user's ID from the session and the friend's ID from the request parameters
        const userId = req.session.userId;
        const friendId = req.params.id;
        // Validate both user IDs
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
            !mongoose_1.default.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the current user
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Current user not found' });
        }
        // Check if the friend is in the current user's friend list
        const friendIndex = user.friends.indexOf(new mongoose_1.default.Types.ObjectId(friendId));
        if (friendIndex === -1) {
            return res
                .status(404)
                .json({ message: 'Friend not found in your friend list' });
        }
        // Remove the friend from the current user's friend list
        user.friends.splice(friendIndex, 1);
        await user.save();
        // Remove the current user from the friend's friend list
        const friend = await user_1.default.findById(friendId);
        if (friend) {
            const userIndex = friend.friends.indexOf(userId);
            if (userIndex !== -1) {
                friend.friends.splice(userIndex, 1);
                await friend.save();
            }
        }
        // Return success response
        return res.status(200).json({ message: 'User unfriended successfully' });
    }
    catch (error) {
        console.error('Error unfriending user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.unfriendById = unfriendById;
// Suspend a user by ID
const suspendUser = async (req, res) => {
    try {
        // Get the user's ID from the request parameters
        const userId = req.params.id;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Suspend the user account
        user.status = 'Suspended';
        await user.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'User account suspended successfully' });
    }
    catch (error) {
        console.error('Error suspending user account:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.suspendUser = suspendUser;
// Resume a suspended user by ID
const resumeUser = async (req, res) => {
    try {
        // Get the user's ID from the request parameters
        const userId = req.params.id;
        // Validate the user ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // Find the user by ID
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the user is already active
        if (user.status === 'Active') {
            return res
                .status(400)
                .json({ message: 'User account is already active' });
        }
        // Reactivate the user account
        user.status = 'Active';
        await user.save();
        // Return success response
        return res
            .status(200)
            .json({ message: 'User account reactivated successfully' });
    }
    catch (error) {
        console.error('Error reactivating user account:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.resumeUser = resumeUser;
