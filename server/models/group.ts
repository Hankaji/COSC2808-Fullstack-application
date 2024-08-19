import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
	{
		group_id: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		visibility: { type: String, required: true, enum: ["Public", "Private"] },
		groupImage: { type: String },
		admins: [{ type: String }],
		members: [{ type: String }],
		posts: [{ type: String }],
	},
	{ timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
export default Group;
