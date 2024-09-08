"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const postController_1 = require("../controllers/postController");
const postRouter = express_1.default.Router();
// Post routes
postRouter.get('/', authentication_1.isAuthenticated, postController_1.getPosts);
postRouter.get('/user/:id', authentication_1.isAuthenticated, postController_1.getUserPosts);
postRouter.get('/group/:id', authentication_1.isAuthenticated, postController_1.getGroupPosts);
postRouter.get('/:id', authentication_1.isAuthenticated, postController_1.getPostById);
postRouter.get('/:id/history', authentication_1.isAuthenticated, postController_1.getPostHistoryById);
postRouter.post('/', authentication_1.isAuthenticated, fileUpload_1.default.array('images'), postController_1.createPost);
postRouter.patch('/:id', authentication_1.isAuthenticated, fileUpload_1.default.array('images'), postController_1.editPost);
postRouter.delete('/:id', authentication_1.isAuthenticated, postController_1.deletePost);
// Comment routes
postRouter.post('/:id/comment', authentication_1.isAuthenticated, postController_1.addCommentToPost);
postRouter.patch('/:id/comment/:comment_id', authentication_1.isAuthenticated, postController_1.editCommentOnPost);
postRouter.delete('/:id/comment/:comment_id', authentication_1.isAuthenticated, postController_1.deleteCommentFromPost);
// Reaction routes
postRouter.post('/:id/reaction', authentication_1.isAuthenticated, postController_1.addReactionToPost);
postRouter.patch('/:id/reaction/', authentication_1.isAuthenticated, postController_1.editReactionOnPost);
postRouter.delete('/:id/reaction', authentication_1.isAuthenticated, postController_1.deleteReactionFromPost);
postRouter.post('/:id/comment/:comment_id/reaction', authentication_1.isAuthenticated, postController_1.addReactionToComment);
postRouter.patch('/:id/comment/:comment_id/reaction', authentication_1.isAuthenticated, postController_1.editReactionOnComment);
postRouter.delete('/:id/comment/:comment_id/reaction', authentication_1.isAuthenticated, postController_1.deleteReactionFromComment);
exports.default = postRouter;
