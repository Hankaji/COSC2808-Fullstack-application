import { Edit, Heart, MessageCircle, Share2, SmilePlus } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Post: FC<Props> = ({ className }) => {
	return (
		<div
			className={`flex flex-col gap-4 w-full h-fit p-4 my-4 border-border border-solid border-2 rounded-lg bg-card ${className}`}
		>
			{/* Author */}
			<div className="flex gap-2">
				{/* TODO fix image */}
				<img
					className="rounded-full bg-gray-500 size-12"
					src="https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6"
					alt="User avatar"
				/>
				<div className="flex flex-col justify-center items-start">
					<h1 className="text-xl font-semibold">
						Anonymous
						<span className="text-muted-foreground"> • 1h</span>
					</h1>
					<p className="text-sm text-muted-foreground font-semibold">
						@UngaBunga
					</p>
				</div>
				<div className="flex ml-auto">
					<Edit className="text-primary" />
				</div>
			</div>
			{/* Content */}
			{/* TODO: Change placeholder */}
			<div className="flex flex-col justify-start items-start gap-2">
				<p>New artwork</p>
				<div className="overflow-hidden w-[600px] aspect-auto rounded-lg">
					<img
						className="object-cover"
						src="https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small"
					/>
				</div>
			</div>
			{/* Post actions */}
			<div className="flex gap-4">
				<button className="flex transition-colors gap-1 p-2 hover:text-danger hover:bg-danger/25 rounded-full">
					<Heart className="" />
					1.3k
				</button>
				<button className="flex transition-colors gap-1 p-2 hover:text-info hover:bg-info/25 rounded-full">
					<MessageCircle className="" />
					817
				</button>
				<button className="flex transition-colors gap-1 p-2 hover:text-success hover:bg-success/25 rounded-full">
					<Share2 className="" />
					462
				</button>
			</div>
		</div>
	);
};

export default Post;
