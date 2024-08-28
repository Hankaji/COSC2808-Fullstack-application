import { useState } from 'react';
import { useLoaderData } from 'react-router';
import Layout from '../../../components/Layout';
import { User } from '../../../types/user';
import UserPanel from './UserPanel';
import UserSideBar from './UserSideBar';

const UserPage = () => {
  const loaderData = useLoaderData() as User;
  const [userData, setUserData] = useState<User>(loaderData);

  const joinedDate = new Date(userData.createdAt);
  console.log(joinedDate);

  return (
    <Layout stickyRightSideCmp={<UserSideBar userData={userData} />}>
      <UserPanel userData={userData} />
    </Layout>
  );
};

export default UserPage;
