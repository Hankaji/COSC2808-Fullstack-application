import Layout from '../../../components/Layout';
import { useParams } from 'react-router';
import GroupPanel from '../../groups/group/GroupPanel';

const PostPage = () => {
  const params = useParams();

  const postId = params.postId;

  return (
    <Layout stickyRightSideCmp={<></>}>
      <GroupPanel />
    </Layout>
  );
};

export default PostPage;
