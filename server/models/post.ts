import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
		content: { type: String, required: true },
		images: [
			{
				data: { type: Buffer, required: true },
				contentType: { type: String, required: true },
			},
		],
		visibility: {
			type: String,
			default: "Public",
			enum: ["Public", "Private", "Friend"],
		},
		reactions: [
			{
				author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
				type: {
					type: String,
					required: true,
					enum: ["Like", "Love", "Haha", "Angry"],
				},
			},
		],
		comments: [
			{
				author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
				content: { type: String, required: true },
				reactions: [
					{
						author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
					enum: ["Public", "Private", "Friend"],
				},
				createdAt: { type: Date, required: true },
			},
		],
	},
	{ timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
export default Post;
