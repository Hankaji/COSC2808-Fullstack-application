import { FC } from 'react';
import SideNavBar from '../components/SideNavBar';

const FriendsPage: FC = () => {
  return (
    <div className="flex min-h-svh gap-4 w-full justify-between">
      <SideNavBar />
      <div className="flex-1 flex justify-center p-12">
        <div className="w-4/5">Friends</div>
      </div>
    </div>
  );
};

export default FriendsPage;
