"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupCreationRequest = exports.GroupRequest = exports.FriendRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const friendRequestSchema = new mongoose_1.default.Schema({
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected'],
    },
}, { timestamps: true });
const groupRequestSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected'],
    },
}, { timestamps: true });
const groupCreationRequestSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group: {
        name: { type: String, required: true },
        description: { type: String, required: true },
        visibility: { type: String, required: true, enum: ['Public', 'Private'] },
        groupImage: {
            data: { type: Buffer },
            contentType: { type: String },
        },
        coverImage: {
            data: { type: Buffer },
            contentType: { type: String },
        },
        admins: [
            { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
        ],
        members: [
            { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
        ],
        posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }],
    },
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
groupCreationRequestSchema.virtual('virtualGroupImage').get(function () {
    if (this.group &&
        this.group.groupImage != null &&
        this.group.groupImage.contentType != null &&
        this.group.groupImage.data != null) {
        return `data:${this.group.groupImage.contentType};base64,${this.group.groupImage.data.toString('base64')}`;
    }
    return undefined;
});
groupCreationRequestSchema.virtual('virtualCoverImage').get(function () {
    if (this.group &&
        this.group.coverImage != null &&
        this.group.coverImage.contentType != null &&
        this.group.coverImage.data != null) {
        return `data:${this.group.coverImage.contentType};base64,${this.group.coverImage.data.toString('base64')}`;
    }
    return undefined;
});
exports.FriendRequest = mongoose_1.default.model('FriendRequest', friendRequestSchema);
exports.GroupRequest = mongoose_1.default.model('GroupRequest', groupRequestSchema);
exports.GroupCreationRequest = mongoose_1.default.model('GroupCreationRequest', groupCreationRequestSchema);
