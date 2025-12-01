import React from 'react';
import { Post } from '../types/post';
import { PostCard } from './PostCard';
import { Loading } from '../../components/ui/Loading';

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  columns?: 1 | 2 | 3 | 4;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  loading = false,
  error = null,
  columns = 3,
  showExcerpt = true,
  showReadingTime = true,
  imageSize = 'medium',
  className = '',
}) => {
  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Loading posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Error Loading Posts</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
        <p className="text-gray-600">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridColumns()} gap-8 ${className}`}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          showExcerpt={showExcerpt}
          showReadingTime={showReadingTime}
          imageSize={imageSize}
          className="hover-lift"
        />
      ))}
    </div>
  );
};
