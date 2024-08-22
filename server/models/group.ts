import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
	{
		name: { type: String, unique: true, require: true },
		description: { type: String, required: true },
		visibility: { type: String, required: true, enum: ["Public", "Private"] },
		groupImage: { type: String },
		coverImage: { type: String },
		admins: [{ type: String }],
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
export default Group;
