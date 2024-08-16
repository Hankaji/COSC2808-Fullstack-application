import { FC, HTMLAttributes } from 'react';
import Post from './Post';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: any; // TODO: add real type
}

const PostsView: FC<Props> = ({ ...props }) => {
  const posts = [1, 2, 3, 4, 5, 6];

  return (
    <div {...props} className={'w-full' + ` ${props.className}`}>
      {posts.map((v) => {
        return <Post key={v} />;
      })}
    </div>
  );
};

export default PostsView;
