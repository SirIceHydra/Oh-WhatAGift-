import { WORDPRESS_CONFIG, WORDPRESS_HEADERS, WORDPRESS_PARAMS } from '../config/wordpress';
import { WordPressPost, WordPressMedia, Post, PostsResponse, PostFilters } from '../types/post';

// Base URL for WordPress API
const BASE_URL = `${WORDPRESS_CONFIG.BASE_URL}/wp-json/${WORDPRESS_CONFIG.API_VERSION}`;

// Cache storage
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < WORDPRESS_CONFIG.DEFAULTS.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

// Preload cache with common requests
export function preloadCache(): void {
  // Preload the main posts request
  fetchPosts({ perPage: 3, orderBy: 'date', order: 'desc' }).catch(() => {
    // Silently fail preloading
  });
}

// Helper function to build query string from params
function buildQueryString(params: Record<string, any>): string {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  );
  return new URLSearchParams(
    Object.entries(filteredParams).map(([k, v]) => [k, String(v)])
  ).toString();
}

// Helper function to make API requests with retry logic
async function apiRequest<T>(
  endpoint: string,
  params?: any
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= WORDPRESS_CONFIG.DEFAULTS.MAX_RETRIES; attempt++) {
    try {
      const url = params
        ? `${BASE_URL}${endpoint}?${buildQueryString(params)}`
        : `${BASE_URL}${endpoint}`;

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WORDPRESS_CONFIG.DEFAULTS.TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: WORDPRESS_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < WORDPRESS_CONFIG.DEFAULTS.MAX_RETRIES) {
        await new Promise(resolve => 
          setTimeout(resolve, WORDPRESS_CONFIG.DEFAULTS.RETRY_DELAY * attempt)
        );
      }
    }
  }
  
  throw new Error(lastError?.message || 'Request failed');
}

// Transform WordPress post to our Post interface
export function transformWordPressPost(wpPost: WordPressPost, media?: WordPressMedia): Post {
  // Try to get media from embedded data first
  let featuredImage = '';
  let featuredImageAlt = wpPost.title.rendered;
  
  if (wpPost._embedded && wpPost._embedded['wp:featuredmedia']) {
    const embeddedMedia = wpPost._embedded['wp:featuredmedia'][0];
    if (embeddedMedia && embeddedMedia.source_url) {
      featuredImage = embeddedMedia.source_url;
      featuredImageAlt = embeddedMedia.alt_text || wpPost.title.rendered;
    }
  } else if (media) {
    featuredImage = media.source_url;
    featuredImageAlt = media.alt_text || wpPost.title.rendered;
  }

  // Decode HTML entities in title and content
  const decodeHtmlEntities = (text: string): string => {
    if (typeof document === 'undefined') {
      // Server-side: use a simple replacement
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    }
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const cleanTitle = decodeHtmlEntities(wpPost.title.rendered);
  const content = wpPost.content.rendered.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(
    WORDPRESS_CONFIG.READING_TIME.MIN_READING_TIME,
    Math.ceil(wordCount / WORDPRESS_CONFIG.READING_TIME.WORDS_PER_MINUTE)
  );

  // Get excerpt - use custom excerpt if available, otherwise generate from content
  let excerpt = wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''); // Strip HTML tags
  excerpt = decodeHtmlEntities(excerpt);
  
  // If excerpt is empty or same as content, generate one
  if (!excerpt || excerpt === content || excerpt.length < 10) {
    excerpt = content.substring(0, 150).trim();
    if (excerpt.length === 150) {
      excerpt += '...';
    }
  }

  // Limit excerpt length
  if (excerpt.length > 160) {
    excerpt = excerpt.substring(0, 157) + '...';
  }

  // Extract categories from embedded data
  let categories: string[] = [];
  if (wpPost._embedded && wpPost._embedded['wp:term']) {
    const terms = wpPost._embedded['wp:term'];
    if (Array.isArray(terms)) {
      // Find the 'category' taxonomy terms
      const categoryTerms = terms.find(termGroup => 
        Array.isArray(termGroup) && termGroup.length > 0 && termGroup[0].taxonomy === 'category'
      );
      
      if (categoryTerms && Array.isArray(categoryTerms)) {
        categories = categoryTerms.map(term => term.name);
      }
    }
  }

  // Extract tags from embedded data
  let tags: string[] = [];
  if (wpPost._embedded && wpPost._embedded['wp:term']) {
    const terms = wpPost._embedded['wp:term'];
    if (Array.isArray(terms)) {
      // Find the 'post_tag' taxonomy terms
      const tagTerms = terms.find(termGroup => 
        Array.isArray(termGroup) && termGroup.length > 0 && termGroup[0].taxonomy === 'post_tag'
      );
      
      if (tagTerms && Array.isArray(tagTerms)) {
        tags = tagTerms.map(term => term.name);
      }
    }
  }

  return {
    id: wpPost.id,
    title: cleanTitle,
    excerpt: excerpt,
    content: wpPost.content.rendered,
    slug: wpPost.slug,
    date: wpPost.date,
    featuredImage: featuredImage,
    featuredImageAlt: featuredImageAlt,
    author: '', // Will be populated separately if needed
    categories: categories,
    tags: tags,
    readingTime,
    seoTitle: cleanTitle,
    seoDescription: excerpt,
    seoKeywords: [...WORDPRESS_CONFIG.SEO.DEFAULT_KEYWORDS],
  };
}

// Fetch posts from WordPress
export async function fetchPosts(filters: PostFilters = {}): Promise<PostsResponse> {
  const cacheKey = `posts_${JSON.stringify(filters)}`;
  
  const cached = getCachedData<PostsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const params: Record<string, any> = {
    [WORDPRESS_PARAMS.STATUS]: WORDPRESS_CONFIG.POST_STATUS.PUBLISH,
    [WORDPRESS_PARAMS.PER_PAGE]: filters.perPage || WORDPRESS_CONFIG.DEFAULTS.POSTS_PER_PAGE,
    [WORDPRESS_PARAMS.PAGE]: filters.page || 1,
    [WORDPRESS_PARAMS.ORDER_BY]: filters.orderBy || 'date',
    [WORDPRESS_PARAMS.ORDER]: filters.order || 'desc',
    [WORDPRESS_PARAMS.EMBED]: true,
  };

  if (filters.search) {
    params[WORDPRESS_PARAMS.SEARCH] = filters.search;
  }
  
  // Handle category filtering - convert slug to ID if needed
  if (filters.category) {
    try {
      // First try to use the category as an ID (if it's numeric)
      const categoryId = parseInt(filters.category);
      if (!isNaN(categoryId)) {
        params[WORDPRESS_PARAMS.CATEGORIES] = categoryId;
      } else {
        // If it's not numeric, treat it as a slug and find the category ID
        const categories = await fetchCategories();
        const category = categories.find(cat => cat.slug === filters.category);
        if (category) {
          params[WORDPRESS_PARAMS.CATEGORIES] = category.id;
        } else {
          // Continue without category filter if not found
        }
      }
    } catch (error) {
      console.error('❌ Error resolving category:', error);
      // Continue without category filter if there's an error
    }
  }
  
  if (filters.tag) {
    params[WORDPRESS_PARAMS.TAGS] = filters.tag;
  }
  if (filters.author) {
    params[WORDPRESS_PARAMS.AUTHOR] = filters.author;
  }

  try {
    const url = `${BASE_URL}${WORDPRESS_CONFIG.ENDPOINTS.POSTS}?${buildQueryString(params)}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WORDPRESS_CONFIG.DEFAULTS.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: WORDPRESS_HEADERS,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const wpPosts: WordPressPost[] = await response.json();
    
    // Get pagination headers
    const totalHeader = response.headers.get('x-wp-total');
    const totalPagesHeader = response.headers.get('x-wp-totalpages');
    
    // Transform posts immediately without fetching media separately
    const posts = wpPosts.map((wpPost) => {
      const transformed = transformWordPressPost(wpPost);
      return transformed;
    });

    const result: PostsResponse = {
      posts,
      total: totalHeader ? parseInt(totalHeader, 10) : posts.length,
      totalPages: totalPagesHeader ? parseInt(totalPagesHeader, 10) : Math.ceil(posts.length / (filters.perPage || WORDPRESS_CONFIG.DEFAULTS.POSTS_PER_PAGE)),
      currentPage: filters.page || 1,
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw error;
  }
}

// Fetch a single post by ID
export async function fetchPost(id: number): Promise<Post> {
  const cacheKey = `post_${id}`;
  
  const cached = getCachedData<Post>(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      [WORDPRESS_PARAMS.EMBED]: true,
    };

    const wpPost: WordPressPost = await apiRequest(
      WORDPRESS_CONFIG.ENDPOINTS.POST(id),
      params
    );

    let media: WordPressMedia | undefined;
    
    if (wpPost.featured_media) {
      try {
        media = await fetchMedia(wpPost.featured_media);
      } catch (error) {
      }
    }

    const post = transformWordPressPost(wpPost, media);
    setCachedData(cacheKey, post);
    return post;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string): Promise<Post> {
  const cacheKey = `post_slug_${slug}`;
  
  const cached = getCachedData<Post>(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      [WORDPRESS_PARAMS.SLUG]: slug,
      [WORDPRESS_PARAMS.EMBED]: true,
    };

    const wpPosts: WordPressPost[] = await apiRequest(
      WORDPRESS_CONFIG.ENDPOINTS.POSTS,
      params
    );

    if (!wpPosts.length) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    const wpPost = wpPosts[0];
    let media: WordPressMedia | undefined;
    
    if (wpPost.featured_media) {
      try {
        media = await fetchMedia(wpPost.featured_media);
      } catch (error) {
      }
    }

    const post = transformWordPressPost(wpPost, media);
    setCachedData(cacheKey, post);
    return post;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw error;
  }
}

// Fetch media by ID
export async function fetchMedia(id: number): Promise<WordPressMedia> {
  const cacheKey = `media_${id}`;
  
  const cached = getCachedData<WordPressMedia>(cacheKey);
  if (cached) return cached;

  try {
    const media = await apiRequest<WordPressMedia>(WORDPRESS_CONFIG.ENDPOINTS.MEDIA_ITEM(id));
    setCachedData(cacheKey, media);
    return media;
  } catch (error) {
    console.error(`Error fetching media ${id}:`, error);
    throw error;
  }
}

// Fetch categories
export async function fetchCategories(): Promise<any[]> {
  const cacheKey = 'categories';
  
  const cached = getCachedData<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const categories: any[] = await apiRequest(WORDPRESS_CONFIG.ENDPOINTS.CATEGORIES);
    setCachedData(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Fetch tags
export async function fetchTags(): Promise<any[]> {
  const cacheKey = 'tags';
  
  const cached = getCachedData<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const tags: any[] = await apiRequest(WORDPRESS_CONFIG.ENDPOINTS.TAGS);
    setCachedData(cacheKey, tags);
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

// Search posts
export async function searchPosts(query: string, filters: Omit<PostFilters, 'search'> = {}): Promise<PostsResponse> {
  return fetchPosts({ ...filters, search: query });
}

// Get related posts (same category)
export async function getRelatedPosts(postId: number, limit: number = 3): Promise<Post[]> {
  try {
    await fetchPost(postId);
    const allPosts = await fetchPosts({ perPage: 100 });
    
    // Filter out the current post and get posts with similar categories
    const relatedPosts = allPosts.posts
      .filter(p => p.id !== postId)
      .slice(0, limit);
    
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
