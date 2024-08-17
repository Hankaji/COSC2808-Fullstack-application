import { FC } from 'react';
import Layout from '../../components/Layout';
import FriendList from './FriendList';

const FriendsPage: FC = () => {
  return (
    <Layout stickyRightSideCmp={<div>right side</div>}>
      <FriendList />
    </Layout>
  );
};

export default FriendsPage;
