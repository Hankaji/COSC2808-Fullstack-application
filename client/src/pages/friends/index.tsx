import { FC } from 'react';
import Layout from '../../components/Layout';
import FriendList from './FriendList';
import FriendRequestList from './FriendRequestList';
import SearchAndAddFriend from './SearchAndAddFriend';

const FriendsPage: FC = () => {
  return (
    <Layout
      stickyRightSideCmp={
        <div className="space-y-4">
          <SearchAndAddFriend />
          <FriendRequestList />
        </div>
      }
    >
      <FriendList />
    </Layout>
  );
};

export default FriendsPage;
