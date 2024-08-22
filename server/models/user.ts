import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true, require: true },
		displayName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		profileImage: {
			data: { type: Buffer, required: true },
			contentType: { type: String, required: true },
		},
		status: { type: String, default: "Active", enum: ["Active", "Suspended"] },
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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

userSchema.virtual("profileImage").get(function () {
	if (this.profileImage != null) {
		return `data:${this.profileImage.contentType};base64,${this.profileImage.data.toString("base64")}`;
	}
	return undefined;
});

export const User = mongoose.model("User", userSchema);
export default User;
