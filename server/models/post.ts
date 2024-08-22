import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        group_id: { type: String },
        content: { type: String, required: true },
        images: [{ type: String }],
        visibility: {
            type: String,
            default: "Public",
            enum: ["Public", "Friend"],
        },
        reactions: [
            {
                author_id: { type: Schema.Types.ObjectId, required: true },
                type: {
                    type: String,
                    required: true,
                    enum: ["Like", "Love", "Haha", "Angry"],
                },
            },
        ],
        comments: [
            {
                author_id: { type: Schema.Types.ObjectId, required: true },
                content: { type: String, required: true },
                reactions: [
                    {
                        author_id: { type: Schema.Types.ObjectId, required: true },
                        type: {
                            type: String,
                            required: true,
                            enum: ["Like", "Love", "Haha", "Angry"],
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
                content: { type: String, required: true },
                images: [{ type: String, required: true }],
                visibility: {
                    type: String,
                    required: true,
                    enum: ["Public", "Friend"],
                },
                createdAt: { type: Date, required: true },
            },
        ],
    },
    { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
export default Post;