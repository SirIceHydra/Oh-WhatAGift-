import React from 'react';
import Link from 'next/link';
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
      href={`/journal/${post.slug}`}
      className={`bg-white text-brand-grey-green shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 rounded-[20px] border-2 border-brand-green/20 ${className}`}
    >
                {post.featuredImage && (
            <div className="relative overflow-hidden rounded-t-[20px]">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                className={`w-full ${getImageHeight()} object-cover hover:scale-105 transition-transform duration-500`}
                loading="lazy"
              />
            </div>
          )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-brand-grey-green/70 mb-2">
          <Clock size={16} />
          <span className="text-sm">{formatDate(post.date)}</span>
          {showReadingTime && (
            <>
              <span className="text-brand-grey-green/40">•</span>
              <span className="text-sm">{post.readingTime} min read</span>
            </>
          )}
        </div>
        
        <h3 className="text-brand-gold text-xl font-bold mb-2 line-clamp-2 hover:text-brand-green transition-colors">
          {decodeHtmlEntities(post.title)}
        </h3>
        
        {showExcerpt && (
          <p className="text-brand-green mb-4 line-clamp-3">
            {decodeHtmlEntities(post.excerpt)}
          </p>
        )}
        
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-brand-light-green text-brand-grey-green text-xs rounded"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <span className="text-brand-light-gold hover:text-brand-green transition-colors flex items-center gap-2 text-sm font-medium">
          READ MORE <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
};
