import type { Request, Response, NextFunction } from 'express';
import Post from '../models/post';
import User from '../models/user';
import Group from '../models/group';

// create a post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { user_id, group_id, content, images, visibility, reactions, comments, editHistory } = req.body;

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
        const postId  = req.params;
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
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// update a post by ID
export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
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
        post.images = updateData.images || post.images;
        post.visibility = updateData.visibility || post.visibility;

        // Save the updated post
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// post reactions
export const postReactions = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { author_id, type } = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the existing reaction by the same author
        const existingReactionIndex = post.reactions.findIndex(reaction => reaction.author_id.toString() === author_id);

        if (existingReactionIndex !== -1) {
            // If the same type is provided, remove the reaction
            if (post.reactions[existingReactionIndex].type === type) {
                post.reactions.splice(existingReactionIndex, 1);
                await post.save();
                return res.status(200).json({ message: 'Reaction removed successfully', post });
            } else {
                // If a different type is provided, update the reaction
                post.reactions[existingReactionIndex].type = type;
                await post.save();
                return res.status(200).json({ message: 'Reaction updated successfully', post });
            }
        } else {
            // If no reaction exists, add a new reaction
            post.reactions.push({ author_id, type });
            await post.save();
            return res.status(200).json({ message: 'Reaction added successfully', post });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// add comment to a post
export const createPostComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { author_id, content } = req.body;

        console.log(`Received postId: ${postId}`); // Log the postId

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