import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true, require: true },
		displayName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		profileImage: { type: String },
		status: { type: String, default: "Active", enum: ["Active", "Suspended"] },
		posts: [{ type: String }],
		friends: [{ type: String }],
		notifications: [
			{
				type: {
					type: String,
					required: true,
					enum: ["User", "Group", "Post", "Comment", "Reaction"],
				},
				message: { type: String, required: true },
				isRead: { type: Boolean, default: false },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export default User;
