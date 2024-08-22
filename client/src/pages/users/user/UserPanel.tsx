import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Post, { Author, AuthorPfp } from '../../../components/Post';

type User = {
  id: string;
  username: string;
  displayname: string;
  profileImg: string;
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
    <div>
      {/* <AuthorPfp */}
      {/*   data={{ */}
      {/*     displayName: userData.displayname, */}
      {/*     username: userData.username, */}
      {/*     avatar: userData.profileImg, */}
      {/*   }} */}
      {/* /> */}
    </div>
  );
};

export default UserPanel;
