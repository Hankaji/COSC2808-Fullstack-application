"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    group_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group' },
    content: { type: String, required: true },
    images: [
        {
            data: { type: Buffer },
            contentType: { type: String },
        },
    ],
    visibility: {
        type: String,
        default: 'Public',
        enum: ['Public', 'Friend'],
    },
    reactions: [
        {
            author_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            type: {
                type: String,
                required: true,
                enum: ['Like', 'Love', 'Haha', 'Angry'],
            },
        },
    ],
    comments: [
        {
            author_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            reactions: [
                {
                    author_id: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                    },
                    type: {
                        type: String,
                        required: true,
                        enum: ['Like', 'Love', 'Haha', 'Angry'],
                    },
                },
            ],
            createdAt: { type: Date, default: Date.now },
            editHistory: [
                {
                    content: { type: String, required: true },
                    createdAt: { type: Date, required: true },
                },
            ],
        },
    ],
    createdAt: { type: Date, default: Date.now },
    editHistory: [
        {
            content: { type: String },
            images: [
                {
                    data: { type: Buffer },
                    contentType: { type: String },
                },
            ],
            visibility: {
                type: String,
                enum: ['Public', 'Friend'],
            },
            createdAt: { type: Date, required: true },
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
postSchema.virtual('virtualImages').get(function () {
    if (this.images != null && this.images.length > 0) {
        return this.images.map((image) => {
            if (image.contentType != null && image.data != null) {
                return `data:${image.contentType};base64,${image.data.toString('base64')}`;
            }
        });
    }
    return undefined;
});
exports.Post = mongoose_1.default.model('Post', postSchema);
exports.default = exports.Post;
