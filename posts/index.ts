// Posts System - WordPress Integration
// This module provides a complete WordPress posts integration system
// that can be easily copied and pasted into different websites.

// Types
export type { 
  Post, 
  PostsResponse, 
  PostFilters, 
  WordPressPost, 
  WordPressMedia 
} from './types/post';

// Configuration
export { WORDPRESS_CONFIG, WORDPRESS_HEADERS, WORDPRESS_PARAMS } from './config/wordpress';

// Services
export {
  fetchPosts,
  fetchPost,
  fetchPostBySlug,
  fetchMedia,
  fetchCategories,
  fetchTags,
  searchPosts,
  getRelatedPosts,
  getCachedData,
  setCachedData,
  clearCache,
  transformWordPressPost,
} from './services/wordpress-api';

// Hooks
export {
  usePosts,
  usePost,
  useRelatedPosts,
  usePostsWithPagination,
} from './hooks/usePosts';

// Components
export { PostCard } from './components/PostCard';
export { PostGrid } from './components/PostGrid';
export { PostDetail } from './components/PostDetail';

// Pages
export { default as PostsPage } from './pages/PostsPage';
export { default as PostDetailPage } from './pages/PostDetailPage';

// Default exports for easy importing
export default {
  // Types
  Post: null, // Import from './types/post'
  
  // Configuration
  WORDPRESS_CONFIG: null, // Import from './config/wordpress'
  
  // Services
  fetchPosts: null, // Import from './services/wordpress-api'
  
  // Hooks
  usePosts: null, // Import from './hooks/usePosts'
  
  // Components
  PostCard: null, // Import from './components/PostCard'
  PostGrid: null, // Import from './components/PostGrid'
  PostDetail: null, // Import from './components/PostDetail'
  
  // Pages
  PostsPage: null, // Import from './pages/PostsPage'
  PostDetailPage: null, // Import from './pages/PostDetailPage'
};
