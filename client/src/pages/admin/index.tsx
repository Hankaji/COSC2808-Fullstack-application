import { FC } from 'react';
import Layout from '../../components/Layout';
import GroupRequestList from './GroupRequestList';
import UserList from './UserList';

const AdminPage: FC = () => {
  return (
    <Layout
      stickyRightSideCmp={<GroupRequestList />}
      mainClassName="overflow-y-hidden"
    >
      <UserList />
    </Layout>
  );
};

export default AdminPage;
