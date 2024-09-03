import { FC, HTMLAttributes } from 'react';
import Post, { Post as PostType } from './Post';
import { mergeClassNames } from '../utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  posts: PostType[];
}

const PostsView: FC<Props> = ({ posts, ...props }) => {
  return (
    <div {...props} className={mergeClassNames('w-full', props.className)}>
      {posts.map((post) => {
        return <Post key={post.id} data={post} />;
      })}
    </div>
  );
};

export default PostsView;
