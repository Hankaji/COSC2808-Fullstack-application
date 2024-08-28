import { useLoaderData } from 'react-router';
import Post from '../../../components/Post';
import { Post as RealPost } from '../../../types/post';

const PostPanel = () => {
  const postData = useLoaderData() as RealPost;

  return (
    <Post
      data={{
        id: postData._id,
        author: {
          avatar: '',
          username: postData.user_id.username,
          displayName: postData.user_id.displayName,
        },
        content: postData.content,
        comments: postData.comments,
        reactions: [],
        editHistories: [],
      }}
    />
  );
};

export default PostPanel;
