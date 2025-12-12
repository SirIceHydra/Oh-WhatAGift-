import React from 'react';
import PostDetailPageAdapter from '../PostDetailPageAdapter';
import { WORDPRESS_CONFIG, WORDPRESS_HEADERS, WORDPRESS_PARAMS } from '@/posts/config/wordpress';

// For static export, fetch all post slugs at build time
export async function generateStaticParams() {
  try {
    const BASE_URL = `${WORDPRESS_CONFIG.BASE_URL}/wp-json/${WORDPRESS_CONFIG.API_VERSION}`;
    const params = new URLSearchParams({
      [WORDPRESS_PARAMS.STATUS]: WORDPRESS_CONFIG.POST_STATUS.PUBLISH,
      [WORDPRESS_PARAMS.PER_PAGE]: '100', // Fetch up to 100 posts per page
      [WORDPRESS_PARAMS.PAGE]: '1',
      [WORDPRESS_PARAMS.ORDER_BY]: 'date',
      [WORDPRESS_PARAMS.ORDER]: 'desc',
    });

    const slugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages of posts
    while (hasMore) {
      params.set(WORDPRESS_PARAMS.PAGE, page.toString());
      const url = `${BASE_URL}${WORDPRESS_CONFIG.ENDPOINTS.POSTS}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: WORDPRESS_HEADERS,
      });

      if (!response.ok) {
        console.warn(`Failed to fetch posts page ${page}:`, response.status);
        break;
      }

      const posts: Array<{ slug: string }> = await response.json();
      
      if (posts.length === 0) {
        hasMore = false;
      } else {
        slugs.push(...posts.map(post => ({ slug: post.slug })));
        
        // Check if there are more pages
        const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1', 10);
        if (page >= totalPages) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return slugs;
  } catch (error) {
    console.error('Error fetching post slugs for static generation:', error);
    // Return empty array if fetch fails (allows fallback to client-side rendering)
    return [];
  }
}

// Journal detail page - uses PostDetailPage component from posts folder
// This page only handles Next.js routing, the actual content is rendered by PostDetailPageAdapter
export default function PostDetailPage({ params }: { params: { slug: string } }) {
  return <PostDetailPageAdapter slug={params.slug} />;
}
