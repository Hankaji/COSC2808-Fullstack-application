import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight <= threshold) {
        onLoadMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onLoadMore, hasMore, threshold]);

  return containerRef;
};
