import { FC, HTMLAttributes } from 'react';
import { mergeClassNames } from '../utils';
import { Posts as PostType } from '../types/post'; // Rename the type import
import Post from './Post'; // Import the Post component with a different name

interface Props extends HTMLAttributes<HTMLDivElement> {
  posts: PostType[]; // Use the renamed type
}

const PostsView: FC<Props> = ({ posts, ...props }) => {
  return (
    <div {...props} className={mergeClassNames('w-full', props.className)}>
      {posts.map((post) => {
        return <Post key={post._id} data={post} />; // Use the Post component with the new name
      })}
    </div>
  );
};

export default PostsView;
