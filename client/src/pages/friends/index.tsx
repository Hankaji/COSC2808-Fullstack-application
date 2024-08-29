import { FC } from 'react';
import Layout from '../../components/Layout';
import SearchAndAddFriend from '../../components/SearchAndAddFriend';
import FriendList from './FriendList';
import FriendRequestList from './FriendRequestList';

const FriendsPage: FC = () => {
  return (
    <Layout
      stickyRightSideCmp={
        <div className="space-y-4">
          <SearchAndAddFriend />
          <FriendRequestList />
        </div>
      }
      mainClassName="overflow-y-hidden"
    >
      <FriendList />
    </Layout>
  );
};

export default FriendsPage;
