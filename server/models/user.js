"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true, require: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: {
        data: { type: Buffer },
        contentType: { type: String },
    },
    status: { type: String, default: 'Active', enum: ['Active', 'Suspended'] },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    notifications: [
        {
            type: {
                type: String,
                required: true,
                enum: ['User', 'Group', 'Post', 'Comment', 'Reaction'],
            },
            message: { type: String, required: true },
            isRead: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual('virtualProfileImage').get(function () {
    if (this.profileImage != null &&
        this.profileImage.contentType != null &&
        this.profileImage.data != null) {
        return `data:${this.profileImage.contentType};base64,${this.profileImage.data.toString('base64')}`;
    }
    return undefined;
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.default = exports.User;
