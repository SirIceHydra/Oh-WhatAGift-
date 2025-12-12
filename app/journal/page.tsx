'use client';

// Journal page - uses BlogHub component from posts folder
// This page only handles Next.js routing, the actual content is rendered by BlogHubAdapter
import BlogHubAdapter from './BlogHubAdapter';

export default function JournalPage() {
  return <BlogHubAdapter />;
}
