'use client';

import React, { useEffect } from 'react';
import { PostDetail } from '@/posts/components/PostDetail';
import { usePost, useRelatedPosts } from '@/posts/hooks/usePosts';
import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';

interface PostDetailPageAdapterProps {
  slug: string;
}

const PostDetailPageAdapter: React.FC<PostDetailPageAdapterProps> = ({ slug }) => {
  const { post, loading, error, fetchPostBySlug } = usePost();
  const { relatedPosts, fetchRelatedPosts } = useRelatedPosts();

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
    }
  }, [slug, fetchPostBySlug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts(post.id, 3);
    }
  }, [post, fetchRelatedPosts]);

  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="pt-8">
        <PostDetail
          post={post}
          loading={loading}
          error={error}
          showRelatedPosts={true}
          relatedPosts={relatedPosts}
        />
      </div>
    </div>
  );
};

export default PostDetailPageAdapter;

