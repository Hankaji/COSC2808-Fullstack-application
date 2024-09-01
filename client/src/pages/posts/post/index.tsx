import Layout from '../../../components/Layout';
import { useLoaderData, useParams } from 'react-router';
import GroupPanel from '../../groups/group/GroupPanel';
import PostPanel from './PostPanel';
import { Posts } from '../../../types/post';

const PostPage = () => {
  const loaderData = useLoaderData() as Posts;
  console.log(loaderData);

  return (
    <Layout stickyRightSideCmp={<></>}>
      <PostPanel />
    </Layout>
  );
};

export default PostPage;
