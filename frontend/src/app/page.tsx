'use client';

import { useState, useRef } from 'react';
import BlogPosts, { BlogPostsRef } from '@/components/BlogPosts';
import ShopifyForm from '@/components/ShopifyForm';

export default function Home() {
  const [credentials, setCredentials] = useState<{
    shopifyDomain: string;
    accessToken: string;
    apiVersion?: string;
  } | null>(null);

  const blogPostsRef = useRef<BlogPostsRef>(null);

  const handleFormSubmit = (formData: {
    shopifyDomain: string;
    accessToken: string;
    apiVersion?: string;
  }) => {
    setCredentials(formData);
  };

  const handleFetchPosts = async () => {
    if (blogPostsRef.current) {
      await blogPostsRef.current.fetchPosts();
    }
  };

  const handleExportToJsonl = async () => {
    if (!blogPostsRef.current || !credentials) return;

    const posts = blogPostsRef.current.getAllPosts();
    if (posts.length === 0) {
      alert('Önce blog yazılarını getirmelisiniz!');
      return;
    }

    // Her yazı için JSONL formatında bir satır oluştur
    const jsonlContent = posts.map(post => {
      const conversation = {
        messages: [
          { role: 'user', content: post.title },
          { role: 'assistant', content: post.content }
        ]
      };
      return JSON.stringify(conversation);
    }).join('\n');

    // Domain adından geçerli bir dosya adı oluştur
    const sanitizedDomain = credentials.shopifyDomain.replace(/[^a-zA-Z0-9]/g, '-');

    // Dosyayı oluştur ve indir
    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-posts-${sanitizedDomain}.jsonl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <ShopifyForm 
          onSubmit={handleFormSubmit} 
          onFetchPosts={handleFetchPosts}
          onExportToJsonl={handleExportToJsonl}
        />
        
        {credentials && (
          <div className="mt-8">
            <BlogPosts 
              ref={blogPostsRef}
              shopifyCredentials={credentials} 
            />
          </div>
        )}
      </div>
    </main>
  );
}
