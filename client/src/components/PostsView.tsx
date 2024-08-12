import { ChevronDown, Globe, Image } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import Post from "./Post";
import PostCreationPanel from "./PostCreationPanel";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const PostsView: FC<Props> = ({ ...props }) => {
	const endpoint = "https://localhost:3000/posts"; // Placeholder, not real endpoint

	const posts = [1, 2, 3, 4, 5, 6];

	return (
		<div {...props} className={"w-full p-8" + ` ${props.className}`}>
			{/* Post something */}
			<PostCreationPanel />
			{posts.map((v) => {
				// return <PlaceholderPost key={v} />;
				return <Post key={v} />;
			})}
		</div>
	);
};

const PlaceholderPost = () => {
	return (
		<div className="w-full h-fit p-4 my-4 border-border border-solid border-2 rounded-lg bg-card">
			<span>Placeholder Only</span>
		</div>
	);
};

export default PostsView;
