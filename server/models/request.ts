import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
	{
		sender_id: { type: String, required: true },
		receiver_id: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

const GroupRequestSchema = new mongoose.Schema(
	{
		user_id: { type: String, required: true },
		group_id: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

const GroupCreationRequestSchema = new mongoose.Schema(
	{
		user_id: { type: String, required: true },
		group: {
			group_id: { type: String, required: true },
			name: { type: String, required: true },
			description: { type: String, required: true },
			visibility: { type: String, required: true, enum: ["Public", "Private"] },
			groupImage: { type: String },
			admins: [{ type: String }],
			members: [{ type: String }],
			posts: [{ type: String }],
		},
		createdAt: { type: Date, default: Date.now },
		status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
	},
	{ timestamps: true }
);

export const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
export const GroupRequest = mongoose.model("GroupRequest", GroupRequestSchema);
export const GroupCreationRequest = mongoose.model("GroupCreationRequest", GroupCreationRequestSchema);
