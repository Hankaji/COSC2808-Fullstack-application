import { FC } from 'react';
import Layout from '../../components/Layout';
import FriendList from './FriendList';
import FriendRequestList from './FriendRequestList';

const FriendsPage: FC = () => {
  return (
    <Layout
      stickyRightSideCmp={
        <div>
          <FriendRequestList />
        </div>
      }
    >
      <FriendList />
    </Layout>
  );
};

export default FriendsPage;
