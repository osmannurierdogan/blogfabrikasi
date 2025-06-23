'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { BlogService, BlogPost } from '@/services/blogService';
import { BlogCard } from './BlogCard';

interface BlogPostsProps {
  shopifyCredentials: {
    shopifyDomain: string;
    accessToken: string;
    apiVersion?: string;
  };
}

export interface BlogPostsRef {
  fetchPosts: () => Promise<void>;
  getAllPosts: () => BlogPost[];
}

const BlogPosts = forwardRef<BlogPostsRef, BlogPostsProps>(({ shopifyCredentials }, ref) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await BlogService.fetchBlogPosts(100, undefined, shopifyCredentials);
      setPosts(result.posts);
    } catch (err) {
      setError('Blog yazıları yüklenirken bir hata oluştu.');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAllPosts = () => posts;

  useImperativeHandle(ref, () => ({
    fetchPosts,
    getAllPosts
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
        Henüz blog yazıları yüklenmedi. Lütfen "Blog Yazılarını Getir" butonuna tıklayın.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
});

BlogPosts.displayName = 'BlogPosts';

export default BlogPosts; 
