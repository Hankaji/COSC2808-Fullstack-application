import mongoose, { Schema } from "mongoose";

const MONGO_URI =
	"mongodb+srv://cuongtran:mypassword@cluster0.0f94w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err.message));


// Change the image type based on the GridFS bucket

const userSchema = new mongoose.Schema({
	user_id: { type: String, required: true },
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	profileImage: { type: String, default: "" },
	status: { type: String, default: "Active", enum: ["Active", "Suspended"] },
	posts: [{ type: String }],
	friends: [{ type: String }],
	notifications: [
		{
			type: {
				type: String,
				required: true,
				enum: [
					"Friend Request",
					"Friend Request Accepted",
					"Comment",
					"Reaction",
					"Group Member Request Approval",
					"Group Creation Approval",
				],
			},
			message: { type: String, required: true },
			isRead: { type: Boolean, default: false },
			createdAt: { type: Date, default: Date.now },
		},
	],
});

const groupSchema = new mongoose.Schema({
	group_id: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	visibility: { type: String, required: true, enum: ["Public", "Private"] },
	groupImage: { type: String, default: "" },
	admins: [{ type: String }],
	members: [{ type: String }],
	posts: [{ type: String }],
});

const postSchema = new mongoose.Schema({
	post_id: { type: String, required: true },
	user_id: { type: String, required: true },
	group_id: { type: String, default: "" },
	content: { type: String, required: true },
	images: [{ type: String, default: "" }],
	visibility: { type: String, default: "Public", enum: ["Public", "Private", "Friend"] },
	reactions: [
		{
			author_id: { type: String, required: true },
			type: { type: String, required: true, enum: ["Like", "Love", "Haha", "Angry"] },
		},
	],
	comments: [
		{
			author_id: { type: String, required: true },
			content: { type: String, required: true },
			reactions: [
				{
					author_id: { type: String, required: true },
					type: { type: String, required: true, enum: ["Like", "Love", "Haha", "Angry"] },
				},
			],
			createdAt: { type: Date, default: Date.now },
			editHistory: [{ content: { type: String, required: true }, createdAt: { type: Date, required: true } }],
		},
	],
	createdAt: { type: Date, default: Date.now },
	editHistory: [
		{
			content: { type: String, required: true },
			images: [{ type: String, required: true }],
			visibility: { type: String, required: true, enum: ["Public", "Private", "Friend"] },
			createdAt: { type: Date, required: true },
		},
	],
});

const FriendRequestSchema = new mongoose.Schema({
	sender_id: { type: String, required: true },
	receiver_id: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
});

const GroupRequestSchema = new mongoose.Schema({
	user_id: { type: String, required: true },
	group_id: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
});

const GroupCreationRequestSchema = new mongoose.Schema({
	user_id: { type: String, required: true },
	group: {
		group_id: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		visibility: { type: String, required: true, enum: ["Public", "Private"] },
		groupImage: { type: String, default: "" },
		admins: [{ type: String }],
		members: [{ type: String }],
		posts: [{ type: String }],
	},
	createdAt: { type: Date, default: Date.now },
	status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
});

export const User = mongoose.model("User", userSchema);
export const Group = mongoose.model("Group", groupSchema);
export const Post = mongoose.model("Post", postSchema);
export const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
export const GroupRequest = mongoose.model("GroupRequest", GroupRequestSchema);
export const GroupCreationRequest = mongoose.model("GroupCreationRequest", GroupCreationRequestSchema);
