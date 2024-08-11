import { Bell, Earth, Home, LogOut, LucideIcon, Settings } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

type SideBarItem = {
	logo: LucideIcon;
	name: string;
	onClick?: () => void;
};

const items: SideBarItem[] = [
	{
		logo: Home,
		name: "Home",
		onClick() {
			console.log("hello");
		},
	},
	{
		logo: Earth,
		name: "Explore",
	},
	{
		logo: Bell,
		name: "Notifications",
	},
];

const bottomActions: SideBarItem[] = [
	{
		logo: LogOut,
		name: "Logout",
	},
	{
		logo: Settings,
		name: "Settings",
	},
];

const SideNavBar = () => {
	return (
		<nav className="flex flex-col justify-start items-start min-h-svh p-12 gap-8">
			{/* Logo */}
			<div className="flex items-center gap-5">
				<img
					className="size-10 object-cover mx-auto"
					style={{ maskSize: "cover", WebkitMaskSize: "cover" }}
					src="/logo.svg"
					alt="SnapMate logo"
				/>
				<span className="font-bold text-3xl">SnapMate</span>
			</div>
			{/* Avatar */}
			<div></div>
			{/* Navigation items */}
			<ul className="flex flex-col gap-6">
				{items.map((item, idx) => {
					return (
						<li key={idx}>
							<SideBarButton data={item} />
						</li>
					);
				})}
			</ul>
			{/* Bottom actions */}
			<div className="flex flex-col justify-end h-full w-full">
				<ul className="flex flex-col gap-6">
					{bottomActions.map((item, idx) => {
						return (
							<li key={idx}>
								<SideBarButton data={item} />
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
};

interface SideBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	data: SideBarItem;
}

const SideBarButton: FC<SideBarButtonProps> = ({ data, ...props }) => {
	return (
		<button
			{...props}
			onClick={data.onClick}
			className="flex justify-start items-center gap-4 hover:bg-primary p-4 w-full rounded-lg transition-all"
		>
			<data.logo size={36} />
			<span className="text-2xl">{data.name}</span>
		</button>
	);
};

export default SideNavBar;
