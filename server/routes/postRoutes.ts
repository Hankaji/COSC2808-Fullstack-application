import express from 'express';
import { createPost, deletePost, getAPost, getAllPosts, updatePost, postReactions, createPostComment, updatePostComment, deletePostComment, getPostsUser, getUserPosts, getGroupPosts, searchPost, searchPostForUser } from '../controllers/postController';
import { uploadMultipleImages } from '../middleware/postMiddleware';

const postRouter = express.Router();

postRouter.post('/createPost', uploadMultipleImages, createPost);
postRouter.delete('/deletePost/:postId', deletePost);
postRouter.get('/getAPost/:id', getAPost);
postRouter.get('/getAllPosts', getAllPosts);
postRouter.put('/updatePost/:id',uploadMultipleImages, updatePost);
postRouter.post('/postReactions/:postId', postReactions);
postRouter.post('/createPostComment/:postId', createPostComment);
postRouter.put('/updatePostComment/:postId/:commentId', updatePostComment);
postRouter.delete('/deletePostComment/:postId/:commentId', deletePostComment);
postRouter.get('/getPostsUser/:id', getPostsUser);
postRouter.get('/getUserPosts/:id', getUserPosts);
postRouter.get('/getGroupPosts/:id', getGroupPosts);
postRouter.get('/searchPost', searchPost);
postRouter.get('/searchPostForUser/:id', searchPostForUser);

export default postRouter;