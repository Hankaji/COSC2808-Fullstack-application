import Layout from '../../../components/Layout';
import UserPanel from './UserPanel';

const UserPage = () => {
  return (
    <Layout stickyRightSideCmp={<></>}>
      <UserPanel />
    </Layout>
  );
};

export default UserPage;
