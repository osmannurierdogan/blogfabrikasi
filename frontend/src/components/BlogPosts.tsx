'use client';

import { useCallback, useEffect, useState } from 'react';
import { BlogService, type BlogPost } from '@/services/blogService';
import { BlogCard } from './BlogCard';

interface BlogPostsState {
  posts: BlogPost[];
  hasNextPage: boolean;
  endCursor: string | null;
}

const INITIAL_STATE: BlogPostsState = {
  posts: [],
  hasNextPage: false,
  endCursor: null,
};

const POSTS_PER_PAGE = 20;

const BlogPosts = () => {
  const [state, setState] = useState<BlogPostsState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (cursor?: string) => {
    try {
      setError(null);
      const { posts: newPosts, hasNextPage, endCursor } = await BlogService.fetchBlogPosts(POSTS_PER_PAGE, cursor);
      
      setState(prevState => ({
        posts: cursor ? [...prevState.posts, ...newPosts] : newPosts,
        hasNextPage,
        endCursor,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !state.hasNextPage || !state.endCursor) return;
    setLoadingMore(true);
    await fetchPosts(state.endCursor);
  }, [loadingMore, state.hasNextPage, state.endCursor, fetchPosts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center p-4">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center p-4 text-red-500">
          <p className="font-semibold mb-2">Error loading blog posts</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!state.posts.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center p-4">No blog posts found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {state.hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 transition-colors duration-200"
          >
            {loadingMore ? 'Loading more posts...' : 'Load more posts'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPosts; 
