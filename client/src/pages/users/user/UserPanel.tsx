import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Post, { Author, AuthorPfp } from '../../../components/Post';

type User = {
  _id: string;
  username: string;
  displayName: string;
  profileImage: string;
  status: 'Active' | 'Suspended';
  posts: Post[];
  friends: Author[];
};

const UserPanel = () => {
  const loaderData = useLoaderData() as User;
  const [userData, setUserData] = useState<User>(loaderData);

  useEffect(() => { }, []);
  console.log(loaderData);

  return (
    <div className="w-full">
      {/* <AuthorPfp */}
      {/*   data={{ */}
      {/*     displayName: userData.displayName, */}
      {/*     username: userData.username, */}
      {/*     avatar: userData.profileImage, */}
      {/*   }} */}
      {/* /> */}
      asasaasasasasasasaas
    </div>
  );
};

export default UserPanel;
