'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PostGrid } from '@/posts/components/PostGrid';
import { usePostsWithPagination } from '@/posts/hooks/usePosts';
import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';

const PostsPageAdapter: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  
  const {
    posts,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    filters,
    goToPage,
    setPerPage,
    setCategory,
    setSearch,
    setOrderBy,
    setOrder,
    clearFilters,
  } = usePostsWithPagination({
    perPage: 9,
    orderBy: 'date',
    order: 'desc',
  });

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams, setCategory, filters.category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
  };

  const hasActiveFilters = filters.category || filters.tag || filters.search || filters.orderBy !== 'date' || filters.order !== 'desc';

  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b-2 border-brand-green/20">
        <div className="container mx-auto px-4 py-8">
          {filters.category && (
            <div className="mb-4">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-green transition-colors font-semibold"
              >
                <ArrowLeft size={20} />
                Back to Journal
              </Link>
            </div>
          )}
          <h2 className="text-brand-gold mb-4 text-center text-[38.4px]">
            {filters.category ? `${filters.category.toUpperCase()} POSTS` : 'BEHIND THE DESIGNS'}
          </h2>
          <p className="text-brand-green text-center max-w-2xl mx-auto">
            {filters.category 
              ? `Discover all posts in the ${filters.category} category.`
              : 'Discover the stories, inspiration, and craftsmanship behind our beautiful designs.'
            }
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md p-6 mb-8 rounded-lg border-2 border-brand-green/20">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-grey-green/60" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-brand-green/30 rounded-lg bg-brand-light-green text-brand-grey-green focus:outline-none focus:border-brand-green"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-brand-green text-white px-4 py-1 rounded hover:bg-brand-green/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-brand-green/30 rounded-lg hover:bg-brand-green/10 transition-colors text-brand-grey-green"
            >
              <Filter size={16} />
              Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-brand-grey-green hover:text-brand-green transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-brand-light-green rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-brand-grey-green mb-2">Sort By</label>
                  <select
                    value={filters.orderBy || 'date'}
                    onChange={(e) => setOrderBy(e.target.value as 'date' | 'title' | 'modified')}
                    className="w-full px-3 py-2 border-2 border-brand-green/30 rounded-lg bg-white text-brand-grey-green focus:outline-none focus:border-brand-green"
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="modified">Last Modified</option>
                  </select>
                </div>

                {/* Sort Direction */}
                <div>
                  <label className="block text-sm font-medium text-brand-grey-green mb-2">Order</label>
                  <select
                    value={filters.order || 'desc'}
                    onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border-2 border-brand-green/30 rounded-lg bg-white text-brand-grey-green focus:outline-none focus:border-brand-green"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {/* Posts Per Page */}
                <div>
                  <label className="block text-sm font-medium text-brand-grey-green mb-2">Posts Per Page</label>
                  <select
                    value={filters.perPage || 9}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-brand-green/30 rounded-lg bg-white text-brand-grey-green focus:outline-none focus:border-brand-green"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-brand-grey-green">
            Showing {posts.length} of {total} posts
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-brand-grey-green/80">
              <span>Active filters:</span>
              {filters.search && (
                <span className="px-2 py-1 bg-brand-light-green text-brand-grey-green rounded">Search: {filters.search}</span>
              )}
              {filters.category && (
                <span className="px-2 py-1 bg-brand-light-green text-brand-grey-green rounded">Category: {filters.category}</span>
              )}
              {filters.tag && (
                <span className="px-2 py-1 bg-brand-light-green text-brand-grey-green rounded">Tag: {filters.tag}</span>
              )}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <PostGrid
          posts={posts}
          loading={loading}
          error={error}
          columns={3}
          showExcerpt={true}
          showReadingTime={true}
          imageSize="medium"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              {/* Previous Page */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border-2 border-brand-green/30 rounded-lg hover:bg-brand-green/10 disabled:opacity-50 disabled:cursor-not-allowed text-brand-grey-green"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 border-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'border-brand-green/30 hover:bg-brand-green/10 text-brand-grey-green'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Page */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border-2 border-brand-green/30 rounded-lg hover:bg-brand-green/10 disabled:opacity-50 disabled:cursor-not-allowed text-brand-grey-green"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPageAdapter;

