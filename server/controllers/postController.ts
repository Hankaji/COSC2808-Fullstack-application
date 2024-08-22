import type { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import Admin from "../models/admin";
import User from "../models/user";
import Group from "../models/group";
import type { SortOrder } from "mongoose";

// create a post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { user_id, group_id, content, visibility, reactions, comments, editHistory } = req.body;
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

        const newPost = new Post({
            user_id,
            group_id,
            content,
            images,
            visibility,
            reactions,
            comments,
            editHistory
        });

        const savedPost = await newPost.save();

        res.status(201).json(savedPost);
    } catch (error: any) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post", error: error.message || error });
    }
};

// delete a post by ID
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};
// get a post by ID
export const getAPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        // Find the post by ID and populate user_id and author_id fields
        const post = await Post.findById(postId)
            .populate("user_id", "username displayName profileImage") 
            .populate("comments.author_id", "username displayName profileImage")
            .populate("reactions.author_id", "username displayName profileImage")
            .populate("comments.reactions.author_id", "username displayName profileImage");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// update a post by ID
export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const updateData = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Save the current state of the post to editHistory
        post.editHistory.push({
            content: post.content,
            images: post.images,
            visibility: post.visibility,
            createdAt: new Date(),
        });

        // Update the post with the new data
        post.content = updateData.content || post.content;
        post.visibility = updateData.visibility || post.visibility;

        // Handle uploaded images
        if (Array.isArray(req.files) && req.files.length > 0) {
            const uploadedImages = (req.files as Express.Multer.File[]).map(file => file.path);
            post.images = uploadedImages;
        } else {
            post.images = updateData.images || post.images;
        }

        // Save the updated post
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// create a reaction to a post
export const createReactPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { author_id, type } = req.body;

        // Find the post by ID and add the new reaction
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    reactions: {
                        author_id,
                        type
                    }
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Return the updated post in the response
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(`Error adding reaction to post: ${error}`);
        res.status(500).json({ message: 'Server error', error });
    }
};

// change a reaction
export const updatePostReaction = async (req: Request, res: Response) => {
    try {
        const { postId, reactionId } = req.params;
        const { type } = req.body;

        // Find the post by ID and update the specific reaction
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, 'reactions._id': reactionId },
            {
                $set: {
                    'reactions.$.type': type
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post or reaction not found' });
        }

        // Return the updated post in the response
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(`Error updating reaction in post: ${error}`);
        res.status(500).json({ message: 'Server error', error });
    }
};

// remove a reaction
export const deletePostReaction = async (req: Request, res: Response) => {
    try {
        const { postId, reactionId } = req.params;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the reaction with the given reactionId and remove it
        const reactionIndex = post.reactions.findIndex(
            (reaction: any) => reaction._id.toString() === reactionId
        );

        if (reactionIndex === -1) {
            return res.status(404).json({ message: "Reaction not found" });
        }

        post.reactions.splice(reactionIndex, 1);

        // Save the updated post
        await post.save();

        return res.status(200).json({ message: "Reaction deleted successfully", post });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// add comment to a post
export const createPostComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { author_id, content } = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add the new comment to the post's comments array
        const newComment = {
            author_id,
            content,
            reactions: [],
            createdAt: new Date(),
            editHistory: []
        };
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// update a comment in a post
export const updatePostComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;
        const { content } = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment within the post's comments array by comment ID
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Add the current content to the edit history before updating
        comment.editHistory.push({ content: comment.content, createdAt: new Date() });

        // Update the comment's content
        comment.content = content;

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// delete a comment in a post
export const deletePostComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the comment within the post's comments array by comment ID
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment
        post.comments.remove(comment);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// make a reaction to a comment in a post
export const createReactionToPostComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;
        const { author_id, type } = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment by ID
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Create a new reaction
        const newReaction = {
            author_id,
            type,
        };

        // Add the new reaction to the comment's reactions array
        comment.reactions.push(newReaction);

        // Save the updated post
        await post.save();

        return res.status(201).json({ message: "Reaction added successfully", post });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// update reaction to a comment in a post
export const updateReactionToPostComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId, reactionId } = req.params;
        const { type } = req.body;

        // Find the post and update the specific reaction in the specified comment
        const post = await Post.findOneAndUpdate(
            { 
                _id: postId, 
                "comments._id": commentId, 
                "comments.reactions._id": reactionId 
            },
            { 
                $set: { "comments.$.reactions.$[reaction].type": type } 
            },
            { 
                arrayFilters: [{ "reaction._id": reactionId }],
                new: true 
            }
        );

        if (!post) {
            return res.status(404).json({ message: "Post or reaction not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// delete reaction from a comment in a post
export const deleteReactionFromPostComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId, reactionId } = req.params;

        // Find the post and remove the specific reaction from the specified comment
        const post = await Post.findOneAndUpdate(
            { 
                _id: postId, 
                "comments._id": commentId 
            },
            { 
                $pull: { "comments.$.reactions": { _id: reactionId } } 
            },
            { 
                new: true 
            }
        );

        if (!post) {
            return res.status(404).json({ message: "Post or reaction not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// get all posts from a group
export const getAllPostsFromGroup = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const { q, page = 1, limit = 10 } = req.query;

        const query = {
            group_id: groupId,
            content: { $regex: q || '', $options: 'i' }
        };
        
        const options = {
            skip: (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10),
            limit: parseInt(limit as string, 10),
            sort: { createdAt: -1 } as { createdAt: SortOrder } // Sort by createdAt in descending order
        };
        
        const posts = await Post.find(query)
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .exec();

        const total = await Post.countDocuments(query);

        return res.status(200).json({
            docs: posts,
            totalDocs: total,
            limit: options.limit,
            page: parseInt(page as string, 10),
            totalPages: Math.ceil(total / options.limit)
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// get all posts from a user
export const getAllPostsFromUser = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.session.userId;
        console.log('Current User ID:', currentUserId);
        const targetUserId = req.params.userId;

        // Extract page and limit from query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Check if the current user is an admin
        const isAdmin = await Admin.exists({ _id: currentUserId });

        if (isAdmin) {
            // If the current user is an admin, return all posts from the target user with pagination and sorting
            const posts = await Post.find({ user_id: targetUserId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.json(posts);
        }

        // Check if the current user is the same as the target user
        if (currentUserId.toString() === targetUserId) {
            // Return all posts with group_id blank with pagination and sorting
            const posts = await Post.find({ user_id: targetUserId, group_id: "" })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.json(posts);
        }

        // Check if the current user is a friend of the target user
        const targetUser = await User.findById(targetUserId);
        const isFriend = targetUser?.friends?.includes(currentUserId.toString()) ?? false;

        if (isFriend) {
            // Return all posts with group_id blank with pagination and sorting
            const posts = await Post.find({ user_id: targetUserId, group_id: "" })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.json(posts);
        }

        // If the current user is not a friend, return all posts with group_id blank and visibility set to Public with pagination and sorting
        const posts = await Post.find({ user_id: targetUserId, group_id: "", visibility: 'Public' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.json(posts);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.session.userId;

        // Extract page and limit from query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Check if the current user is an admin
        const isAdmin = await Admin.exists({ _id: currentUserId });

        if (isAdmin) {
            // If the current user is an admin, return all posts sorted by createdAt in descending order
            const posts = await Post.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.json(posts);
        }

        // Get the current user's friends
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const friends = currentUser.friends;

        // Get the groups the current user is a member of
        const groups = await Group.find({ members: currentUserId });
        const groupIds = groups.map(group => group._id);

        // Find posts from friends and groups the user is a member of and sorted by createdAt in descending order
        const posts = await Post.find({
            $or: [
                { user_id: { $in: friends } },
                { group_id: { $in: groupIds } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.json(posts);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};