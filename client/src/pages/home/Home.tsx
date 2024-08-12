import PostsView from "../../components/PostsView";
import RightSideBar from "../../components/RightSideBar";
import SideNavBar from "../../components/SideNavBar";

const HomePage = () => {
	return (
		<div className="flex min-h-svh gap-4 w-full justify-between">
			<SideNavBar />
			<PostsView />
			<RightSideBar />
		</div>
	);
};

export default HomePage;
