// WordPress Posts Configuration
export const WORDPRESS_CONFIG = {
  // WordPress Site Configuration
  BASE_URL: process.env.REACT_APP_WORDPRESS_URL || 'https://your-wordpress-site.com',
  API_VERSION: 'wp/v2',
  
  // API Endpoints
  ENDPOINTS: {
    POSTS: '/posts',
    POST: (id: number) => `/posts/${id}`,
    MEDIA: '/media',
    MEDIA_ITEM: (id: number) => `/media/${id}`,
    CATEGORIES: '/categories',
    TAGS: '/tags',
    USERS: '/users',
    USER: (id: number) => `/users/${id}`,
  },
  
  // Default Settings
  DEFAULTS: {
    POSTS_PER_PAGE: 10,
    MAX_POSTS_PER_PAGE: 100,
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes (increased for better performance)
    TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
  
  // Post Status
  POST_STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PRIVATE: 'private',
    PENDING: 'pending',
  },
  
  // Image Sizes
  IMAGE_SIZES: {
    THUMBNAIL: 'thumbnail',
    MEDIUM: 'medium',
    LARGE: 'large',
    FULL: 'full',
  },
  
  // Reading Time Calculation
  READING_TIME: {
    WORDS_PER_MINUTE: 200,
    MIN_READING_TIME: 1,
  },
  
  // SEO Settings
  SEO: {
    DEFAULT_TITLE_TEMPLATE: '%title% | %site_name%',
    DEFAULT_DESCRIPTION_LENGTH: 160,
    DEFAULT_KEYWORDS: ['nutrition', 'fitness', 'health'],
  },
} as const;

// WordPress API Headers
export const WORDPRESS_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// WordPress Query Parameters
export const WORDPRESS_PARAMS = {
  EMBED: '_embed',
  PER_PAGE: 'per_page',
  PAGE: 'page',
  ORDER_BY: 'orderby',
  ORDER: 'order',
  SEARCH: 'search',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  AUTHOR: 'author',
  STATUS: 'status',
  AFTER: 'after',
  BEFORE: 'before',
  MODIFIED_AFTER: 'modified_after',
  MODIFIED_BEFORE: 'modified_before',
  SLUG: 'slug',
  INCLUDE: 'include',
  EXCLUDE: 'exclude',
  OFFSET: 'offset',
  STICKY: 'sticky',
} as const;
