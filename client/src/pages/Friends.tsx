import { FC } from "react";
import Sidebar from "../components/Sidebar";

const FriendsPage: FC = () => {
  return (
    <div className="flex min-h-svh gap-4 w-full justify-between">
      <Sidebar />
      <div className="flex-1 flex justify-center p-12">
        <div className="w-4/5">Friends</div>
      </div>
    </div>
  );
};

export default FriendsPage;
