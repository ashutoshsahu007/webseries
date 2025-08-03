import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(items, batchSize = 20) {
  const [limit, setLimit] = useState(batchSize);
  const displayItems = items.slice(0, limit);
  const hasMore = items.length > displayItems.length;

  const observer = useRef(null);

  const loadMore = () => {
    setLimit((l) => Math.min(items.length, l + batchSize));
  };

  const observerRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    setLimit(batchSize);
  }, [items]);

  return { displayItems, loadMore, hasMore, observerRef };
}
