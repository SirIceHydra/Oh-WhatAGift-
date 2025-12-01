# 📝 Posts System - WordPress Integration

A portable, modular posts system that integrates with WordPress REST API. This system can be easily copied and pasted into different websites with minimal configuration.

## 🚀 Quick Start

### 1. Installation

Copy the entire `posts` folder to your React project:

```bash
cp -r src/posts ./your-project/src/
```

### 2. Configuration

Set up your environment variables:

```bash
# .env
VITE_WORDPRESS_URL=https://your-wordpress-site.com
VITE_WORDPRESS_API_VERSION=wp/v2
VITE_WORDPRESS_POSTS_PER_PAGE=10
VITE_WORDPRESS_CACHE_DURATION=300000
```

### 3. Usage

#### Basic Posts Grid
```tsx
import { PostGrid, usePosts } from './posts';

function MyComponent() {
  const { posts, loading, error } = usePosts({
    initialFilters: { perPage: 6, orderBy: 'date', order: 'desc' }
  });

  return (
    <PostGrid
      posts={posts}
      loading={loading}
      error={error}
      columns={3}
    />
  );
}
```

#### Individual Post
```tsx
import { PostDetail, usePost } from './posts';

function PostPage() {
  const { post, loading, error, fetchPostBySlug } = usePost();

  useEffect(() => {
    fetchPostBySlug('my-post-slug');
  }, []);

  return (
    <PostDetail
      post={post}
      loading={loading}
      error={error}
    />
  );
}
```

## 📁 File Structure

```
posts/
├── components/
│   ├── PostCard.tsx          # Individual post card component
│   ├── PostGrid.tsx          # Grid layout for multiple posts
│   └── PostDetail.tsx        # Full post detail view
├── config/
│   └── wordpress.ts          # WordPress API configuration
├── hooks/
│   └── usePosts.ts           # React hooks for posts management
├── pages/
│   ├── PostsPage.tsx         # All posts page with filters
│   └── PostDetailPage.tsx    # Individual post page
├── services/
│   └── wordpress-api.ts      # WordPress API service functions
├── types/
│   └── post.ts               # TypeScript type definitions
├── index.ts                  # Main exports
└── README.md                 # This file
```

## 🔧 Configuration

### WordPress Setup

1. **Install WordPress** with REST API enabled
2. **Set permalinks** to "Post name" (`/%postname%/`)
3. **Configure CORS** headers for your frontend domain
4. **Create categories and tags** for content organization
5. **Add sample posts** with featured images

See `WORDPRESS_POSTS_SETUP.md` for detailed WordPress configuration.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_WORDPRESS_URL` | WordPress site URL | `https://your-wordpress-site.com` |
| `VITE_WORDPRESS_API_VERSION` | API version | `wp/v2` |
| `VITE_WORDPRESS_POSTS_PER_PAGE` | Posts per page | `10` |
| `VITE_WORDPRESS_CACHE_DURATION` | Cache duration (ms) | `300000` |

## 🎯 Features

### ✅ Core Features
- **WordPress REST API Integration** - Full compatibility with WordPress
- **Responsive Design** - Mobile-first approach
- **TypeScript Support** - Full type safety
- **Caching System** - Built-in API response caching
- **Error Handling** - Comprehensive error management
- **Loading States** - User-friendly loading indicators

### ✅ Advanced Features
- **Search & Filtering** - Search posts by title/content
- **Pagination** - Built-in pagination support
- **Related Posts** - Automatic related posts detection
- **SEO Optimized** - Meta tags and structured data
- **Image Optimization** - Lazy loading and responsive images
- **Reading Time** - Automatic reading time calculation

### ✅ Customization
- **Flexible Grid Layouts** - 1-4 column support
- **Custom Styling** - Tailwind CSS classes
- **Component Props** - Extensive customization options
- **Hook-based** - Easy state management

## 📖 API Reference

### Hooks

#### `usePosts(options)`
```tsx
const { posts, loading, error, fetchPosts } = usePosts({
  initialFilters: { perPage: 10, orderBy: 'date' },
  autoFetch: true
});
```

#### `usePost(options)`
```tsx
const { post, loading, error, fetchPostBySlug } = usePost({
  autoFetch: false
});
```

#### `usePostsWithPagination(initialFilters)`
```tsx
const {
  posts,
  loading,
  currentPage,
  totalPages,
  goToPage,
  setSearch,
  clearFilters
} = usePostsWithPagination({
  perPage: 9,
  orderBy: 'date'
});
```

### Components

#### `PostCard`
```tsx
<PostCard
  post={post}
  showExcerpt={true}
  showReadingTime={true}
  imageSize="medium"
  className="custom-class"
/>
```

#### `PostGrid`
```tsx
<PostGrid
  posts={posts}
  loading={loading}
  error={error}
  columns={3}
  showExcerpt={true}
  imageSize="medium"
/>
```

#### `PostDetail`
```tsx
<PostDetail
  post={post}
  loading={loading}
  error={error}
  showRelatedPosts={true}
  relatedPosts={relatedPosts}
/>
```

### Services

#### `fetchPosts(filters)`
```tsx
const posts = await fetchPosts({
  perPage: 10,
  page: 1,
  category: 'recipes',
  search: 'protein',
  orderBy: 'date',
  order: 'desc'
});
```

#### `fetchPostBySlug(slug)`
```tsx
const post = await fetchPostBySlug('my-post-slug');
```

## 🎨 Styling

The system uses Tailwind CSS for styling. All components are fully customizable through:

- **CSS Classes** - Pass custom classes via `className` prop
- **Tailwind Utilities** - Use Tailwind classes for quick styling
- **Component Props** - Configure appearance through props

### Custom Styling Example
```tsx
<PostCard
  className="bg-blue-50 hover:bg-blue-100"
  showExcerpt={false}
  imageSize="large"
/>
```

## 🔄 Migration Guide

### From Static Posts to WordPress

1. **Backup current posts** - Save existing post data
2. **Set up WordPress** - Follow WordPress setup guide
3. **Import content** - Create posts in WordPress
4. **Update environment** - Set WordPress URL
5. **Test integration** - Verify posts load correctly

### From Other CMS

1. **Export content** - Export posts from current CMS
2. **Import to WordPress** - Use WordPress import tools
3. **Configure system** - Set up environment variables
4. **Update routes** - Point to new WordPress URLs

## 🛠️ Troubleshooting

### Common Issues

#### Posts Not Loading
```bash
# Check WordPress URL
echo $VITE_WORDPRESS_URL

# Test API endpoint
curl https://your-wordpress-site.com/wp-json/wp/v2/posts
```

#### CORS Errors
```bash
# Add to WordPress .htaccess
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

#### Images Not Displaying
```bash
# Check image URLs
# Verify WordPress media settings
# Test image accessibility
```

### Debug Mode

Enable debug logging:
```tsx
// Add to your component
useEffect(() => {
  console.log('Posts:', posts);
  console.log('Loading:', loading);
  console.log('Error:', error);
}, [posts, loading, error]);
```

## 📚 Examples

### Basic Blog Page
```tsx
import { PostGrid, usePosts } from './posts';

function BlogPage() {
  const { posts, loading, error } = usePosts({
    initialFilters: { perPage: 12, orderBy: 'date', order: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <PostGrid
        posts={posts}
        loading={loading}
        error={error}
        columns={3}
      />
    </div>
  );
}
```

### Search and Filter
```tsx
import { usePostsWithPagination } from './posts';

function SearchPage() {
  const {
    posts,
    loading,
    setSearch,
    setCategory,
    clearFilters
  } = usePostsWithPagination();

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <PostGrid posts={posts} loading={loading} />
    </div>
  );
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. **Check the documentation** - Review this README and setup guides
2. **Search issues** - Look for similar problems
3. **Create an issue** - Provide detailed information about your problem
4. **Contact support** - Reach out to the development team

---

**Happy coding! 🚀**
