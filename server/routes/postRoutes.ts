import express from "express";
import { createPost, deletePost, updatePost, getAPost, createReactPost, updatePostReaction, deletePostReaction, createPostComment, updatePostComment, deletePostComment, createReactionToPostComment, updateReactionToPostComment, deleteReactionFromPostComment } from "../controllers/postController";

const postRouter = express.Router();

// Post routes
postRouter.post("/", createPost);
postRouter.post("/:postId/reactions", createReactPost);
postRouter.post("/:postId/comments", createPostComment);
postRouter.post("/:postId/comments/:commentId/reactions", createReactionToPostComment);

// Delete routes
postRouter.delete("/:postId", deletePost);
postRouter.delete("/:postId/reactions/:reactionId", deletePostReaction);
postRouter.delete("/:postId/comments/:commentId", deletePostComment);
postRouter.delete("/:postId/comments/:commentId/reactions/:reactionId", deleteReactionFromPostComment);

// Patch routes
postRouter.patch("/:postId", updatePost);
postRouter.patch('/:postId/reactions/:reactionId', updatePostReaction);
postRouter.patch('/:postId/comments/:commentId', updatePostComment);
postRouter.patch("/:postId/comments/:commentId/reactions/:reactionId", updateReactionToPostComment);

// Get routes
postRouter.get("/:postId", getAPost);