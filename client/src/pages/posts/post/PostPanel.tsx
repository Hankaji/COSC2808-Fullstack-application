import { useLoaderData } from 'react-router';
import Post from '../../../components/Post';
import { Posts as RealPost } from '../../../types/post';

const PostPanel = () => {
  const postData = useLoaderData() as RealPost;

  return (
      <Post
        data={{
          _id: postData._id,
          user: {
            virtualProfileImage: '',
            username: postData.user.username,
            displayName: postData.user.displayName,
            _id: '',
            id: ''
          },
          content: postData.content,
          comments: postData.comments,
          reactions: [],
          editHistory: [],
          group_id: null,
          images: [],
          visibility: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0
        }}
      />
    );
};

export default PostPanel;
