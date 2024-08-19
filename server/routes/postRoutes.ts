import express from 'express';
import { createPost, deletePost, getAPost, getAllPosts, updatePost, postReactions, createPostComment, updatePostComment, deletePostComment } from '../controllers/postController';
import { uploadMultipleImages } from '../middleware/postMiddleware';

const postRouter = express.Router();

postRouter.post('/createPost', uploadMultipleImages, createPost);
postRouter.delete('/deletePost/:postId', deletePost);
postRouter.get('/getAPost/:id', getAPost);
postRouter.get('/getAllPosts', getAllPosts);
postRouter.put('/updatePost/:id', updatePost);
postRouter.post('/postReactions/:postId', postReactions);
postRouter.post('/createPostComment/:postId', createPostComment);
postRouter.put('/updatePostComment/:postId/:commentId', updatePostComment);
postRouter.delete('/deletePostComment/:postId/:commentId', deletePostComment);

export default postRouter;