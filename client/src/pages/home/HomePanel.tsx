import { FC, useCallback, useEffect, useState } from 'react';
import PostCreationPanel from '../../components/PostCreationPanel';
import PostsView from '../../components/PostsView';

const HomePanel: FC<{ className?: string }> = ({ className }) => {
  const endpoint = 'https://localhost:3000/posts'; // Placeholder, not real endpoint

  const [postData, setPostData] = useState<any>([]);
  const [page, setPage] = useState<number>(0);

  const getPosts = useCallback(async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setPostData((prev: any) => [...prev, ...data.posts]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={className}>
      {/* Post something */}
      <PostCreationPanel />
      <PostsView data={null} />
    </div>
  );
};

export default HomePanel;
