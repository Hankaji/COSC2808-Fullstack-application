import express from 'express';
import { createPost, deletePost, getAPost, getAllPosts, updatePost, postReactions, createPostComment, updatePostComment, deletePostComment, getPostsUser, getUserPosts, getGroupPosts, searchPost, searchPostForUser, postCommentReactions, getUserPostsNotInGroup } from '../controllers/postController';
import { uploadMultipleImages } from '../middleware/postMiddleware';

const postRouter = express.Router();

// Post routes
postRouter.post('/createPost', uploadMultipleImages, createPost);
postRouter.post('/postCommentReactions/:postId/:commentId', postCommentReactions);
postRouter.post('/postReactions/:postId', postReactions);
postRouter.post('/createPostComment/:postId', createPostComment);

// Delete routes
postRouter.delete('/deletePost/:postId', deletePost);
postRouter.delete('/deletePostComment/:postId/:commentId', deletePostComment);

// Update routes (PUT)
postRouter.put('/updatePost/:id',uploadMultipleImages, updatePost);
postRouter.put('/updatePostComment/:postId/:commentId', updatePostComment);

// Get routes
postRouter.get('/getAPost/:id', getAPost);
postRouter.get('/getAllPosts', getAllPosts);
postRouter.get('/getPostsUser/:id', getPostsUser);
postRouter.get('/getUserPosts/:id', getUserPosts);
postRouter.get('/getUserPostsNotInGroup/:id', getUserPostsNotInGroup);
postRouter.get('/getGroupPosts/:id', getGroupPosts);
postRouter.get('/searchPost', searchPost);
postRouter.get('/searchPostForUser/:id', searchPostForUser);

export default postRouter;