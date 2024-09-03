import { useLoaderData } from 'react-router';
import Layout from '../../../components/Layout';
import { User } from '../../../types/user';
import UserPanel from './UserPanel';
import UserSideBar from './UserSideBar';

const UserPage = () => {
  const loaderData = useLoaderData() as User;

  return (
    <Layout stickyRightSideCmp={<UserSideBar userData={loaderData} />}>
      <UserPanel userData={loaderData} />
    </Layout>
  );
};

export default UserPage;
