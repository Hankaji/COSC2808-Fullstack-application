import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
	{
		sender_id: { type: String, required: true },
		receiver_id: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

const groupRequestSchema = new mongoose.Schema(
	{
		user_id: { type: String, required: true },
		group_id: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

const groupCreationRequestSchema = new mongoose.Schema(
	{
		user_id: { type: String, required: true },
		group: {
			name: { type: String, required: true },
			description: { type: String, required: true },
			visibility: { type: String, required: true, enum: ["Public", "Private"] },
			groupImage: { type: String },
			coverImage: { type: String },
			admins: [{ type: String }],
			members: [{ type: String }],
			posts: [{ type: String }],
		},
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export const GroupRequest = mongoose.model("GroupRequest", groupRequestSchema);
export const GroupCreationRequest = mongoose.model("GroupCreationRequest", groupCreationRequestSchema);
