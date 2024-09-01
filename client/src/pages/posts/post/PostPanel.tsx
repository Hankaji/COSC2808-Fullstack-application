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
          username: postData.user.username,
          displayName: postData.user.displayName,
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
