import { FC } from 'react';
import Tabs, { Tab } from '../../components/Tabs';
import Layout from '../../components/Layout';
import FriendList from './FriendList';
import FriendRequestList from './FriendRequestList';
import FriendSuggestionList from './FriendSuggestionList';

const tabs: Tab[] = [
  {
    name: 'My friends',
    element: <FriendList />,
  },
  {
    name: 'Requests',
    element: <FriendRequestList />,
  },
  {
    name: 'Suggestions',
    element: <FriendSuggestionList />,
  },
];

const FriendsPage: FC = () => {
  return (
    <Layout mainClassName="overflow-y-hidden">
      <Tabs tabs={tabs} />
    </Layout>
  );
};

export default FriendsPage;
