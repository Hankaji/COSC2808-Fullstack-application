import { useLoaderData } from 'react-router';
import Layout from '../../../components/Layout';
import { parseUser, User } from '../../../types/user';
import UserPanel from './UserPanel';
import UserSideBar from './UserSideBar';

const UserPage = () => {
  const loaderData = useLoaderData() as User;
  const [userData, setUserData] = useState<User>(parseUser(loaderData));

  return (
    <Layout stickyRightSideCmp={<UserSideBar userData={loaderData} />}>
      <UserPanel userData={loaderData} />
    </Layout>
  );
};

export default UserPage;
