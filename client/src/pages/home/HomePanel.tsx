import { FC, useCallback, useEffect, useState } from 'react';
import Post from '../../components/Post';
import PostCreationPanel from '../../components/PostCreationPanel';
import PostsView from '../../components/PostsView';
import { URL_BASE } from '../../config';
import useAuth from '../../hooks/useAuth';

const mockData: Post[] = [
  {
    id: '1',
    author: {
      avatar:
        'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
      username: 'UngaBunga',
      displayName: 'Anonymous',
    },
    content: 'Check out my new artwork',
    images: [
      'https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small',
    ],
    reactions: [],
    comments: [],
    editHistories: [],
  },
];

const HomePanel: FC<{ className?: string }> = ({ className }) => {
  const { auth } = useAuth();
  console.log('This is auth: ' + JSON.stringify(auth.user));

  const endpoint = `${URL_BASE}/posts`; // Placeholder, not real endpoint

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
  }, [page]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className={className}>
      {/* Post something */}
      <PostCreationPanel />
      <PostsView posts={mockData} />
    </div>
  );
};

export default HomePanel;
