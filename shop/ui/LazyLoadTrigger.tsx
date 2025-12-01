import React, { useEffect, useRef } from 'react';

interface LazyLoadTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  isLoadingMore?: boolean;
}

export function LazyLoadTrigger({ onLoadMore, hasMore, loading, isLoadingMore = false }: LazyLoadTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onLoadMore, hasMore, loading, isLoadingMore]);

  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-tertiary/70">No more products to load</p>
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="flex justify-center py-8 transition-all duration-300">
      {loading || isLoadingMore ? (
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tertiary"></div>
          <span className="text-tertiary">Loading more products...</span>
        </div>
      ) : (
        <button
          onClick={onLoadMore}
          className="btn btn-primary px-6 py-3 hover:scale-105 transition-transform duration-200"
        >
          Load More Products
        </button>
      )}
    </div>
  );
}
