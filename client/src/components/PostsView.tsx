import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { mergeClassNames } from '../utils';
import { parsePost, Posts } from '../types/post'; // Rename the type import
import Post from './Post'; // Import the Post component with a different name
import Loading from './ui/Loading';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import useInView from '../hooks/useInView';

interface Props extends HTMLAttributes<HTMLDivElement> {
  fetchEndpoint: string;
}

interface PostsViewRef {
  fetchPosts: () => Promise<void>;
  reset: () => void;
}

const PostsView = forwardRef<PostsViewRef, Props>(
  ({ fetchEndpoint, ...props }, ref) => {
    const [posts, setPosts] = useState<Posts[] | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      fetchPosts,
      reset,
    }));

    const [viewRef, inView] = useInView<HTMLDivElement>(hasMore);

    const reset = () => {
      setPosts(undefined);
      setHasMore(true);
      setPage(1);
    };

    // Fetch posts from the endpoint
    const fetchPosts = async () => {
      // Set this so fetch won't be called multiple times
      setIsFetching(true);
      try {
        // SearchParams
        const params = new URLSearchParams({
          page: page.toString(),
        });

        const res = await fetch(`${fetchEndpoint}?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
        });

        console.log(res);

        if (res.ok) {
          // Get data and parse it
          const data: any[] = await res.json();
          const fetchedPosts = data.map((post) => parsePost(post));

          console.log(fetchedPosts);

          // 10 is the limit per page
          if (fetchedPosts.length < 10) {
            setHasMore(false); // If no more posts, set hasMore to false
          }
          setPosts((prevPosts) =>
            prevPosts ? [...prevPosts, ...fetchedPosts] : fetchedPosts,
          );

          // Increase page value for next fetch
          setPage((prev) => prev + 1);
          setIsFetching(false);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    useEffect(() => {
      if (!isFetching && hasMore) {
        fetchPosts();
      }
    }, [inView]);

    return (
      <div {...props} className={mergeClassNames('w-full', props.className)}>
        {posts ? (
          posts.length > 0 ? (
            posts.map((post) => {
              return <Post key={post.id} data={post} />;
            })
          ) : (
            <div className="p-12 flex gap-2 justify-center items-center">
              This user hasn't published any posts
            </div>
          )
        ) : (
          <div className="p-12 flex gap-2 justify-center items-center">
            <Loading /> Getting posts
          </div>
        )}
        {posts &&
          posts.length > 0 &&
          (hasMore ? (
            <div
              ref={viewRef}
              className="p-12 flex gap-2 justify-center items-center"
            >
              <Loading /> Loading more posts
            </div>
          ) : (
            <div className="p-12 flex gap-2 justify-center items-center">
              Congratulation! You have reached the end of your journey.
            </div>
          ))}
      </div>
    );
  },
);

export type { PostsViewRef };
export default PostsView;
