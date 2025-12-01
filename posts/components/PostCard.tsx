import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Post } from '../types/post';

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

interface PostCardProps {
  post: Post;
  className?: string;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className = '',
  showExcerpt = true,
  showReadingTime = true,
  imageSize = 'medium',
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).toUpperCase();
  };

  const getImageHeight = () => {
    switch (imageSize) {
      case 'small':
        return 'h-32';
      case 'large':
        return 'h-64';
      default:
        return 'h-48';
    }
  };

  return (
    <Link
      to={`/posts/${post.slug}`}
      className={`bg-primarySupport text-tertiary shadow-lg overflow-hidden hover-lift transition-all duration-300 ${className}`}
    >
                {post.featuredImage && (
            <div className="relative overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                className={`w-full ${getImageHeight()} object-contain hover:scale-105 transition-transform duration-500`}
                loading="lazy"
              />
            </div>
          )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Clock size={16} />
          <span className="text-sm">{formatDate(post.date)}</span>
          {showReadingTime && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-sm">{post.readingTime} min read</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-tertiary transition-colors">
          {decodeHtmlEntities(post.title)}
        </h3>
        
        {showExcerpt && (
          <p className="text-gray-700 mb-4 line-clamp-3">
            {decodeHtmlEntities(post.excerpt)}
          </p>
        )}
        
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-tertiary/20 text-tertiary text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <span className="text-tertiary hover:text-primarySupport transition-colors flex items-center gap-2 text-sm font-medium">
          READ MORE <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
};
