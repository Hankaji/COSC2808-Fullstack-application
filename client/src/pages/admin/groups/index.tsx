import { FC } from 'react';
import Layout from '../../../components/Layout';
import Tabs, { Tab } from '../../../components/Tabs';

const tabs: Tab[] = [
  {
    name: 'All Groups',
    element: 'All Groups',
  },
  {
    name: 'Group Requests',
    element: 'Group Requests',
  },
];

const AdminGroupsPage: FC = () => {
  return (
    <Layout mainClassName="overflow-y-hidden">
      <Tabs tabs={tabs} />
    </Layout>
  );
};

export default AdminGroupsPage;
