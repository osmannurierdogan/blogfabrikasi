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

  const formatHtmlToTxt = (html: string): string => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let formattedText = '';

    // Process each element
    const processNode = (node: Node, level: number = 0): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          formattedText += text + '\n';
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const element = node as HTMLElement;

      // Handle tables
      if (element.tagName === 'TABLE') {
        const rows = element.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].children;
          for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const isHeader = cell.tagName === 'TH';
            const cellText = cell.textContent?.trim() || '';
            
            // If it's a header cell or first cell in row, treat it as property name
            if (isHeader || j === 0) {
              formattedText += `- ${cellText}: `;
            } else {
              formattedText += `${cellText}\n`;
            }
          }
        }
        formattedText += '\n';
        return;
      }

      // Handle headings
      if (element.tagName.match(/^H[1-6]$/)) {
        formattedText += '\n' + element.textContent?.trim() + '\n' + '='.repeat(40) + '\n\n';
        return;
      }

      // Handle paragraphs
      if (element.tagName === 'P') {
        formattedText += '\n' + element.textContent?.trim() + '\n\n';
        return;
      }

      // Handle lists
      if (element.tagName === 'UL' || element.tagName === 'OL') {
        formattedText += '\n';
        Array.from(element.children).forEach((li, index) => {
          const bullet = element.tagName === 'UL' ? '• ' : `${index + 1}. `;
          formattedText += bullet + li.textContent?.trim() + '\n';
        });
        formattedText += '\n';
        return;
      }

      // Process child nodes
      Array.from(node.childNodes).forEach(child => processNode(child, level + 1));
    };

    processNode(tempDiv);
    return formattedText.replace(/\n{3,}/g, '\n\n').trim();
  };

  const handleExportToTxt = async () => {
    if (!blogPostsRef.current || !credentials) return;

    const posts = blogPostsRef.current.getAllPosts();
    if (posts.length === 0) {
      alert('Önce blog yazılarını getirmelisiniz!');
      return;
    }

    // Her yazı için TXT formatında içerik oluştur
    const txtContent = posts.map(post => {
      return `Başlık: ${post.title}
Yazar: ${post.author?.name || 'Anonim'}
Tarih: ${new Date(post.publishedAt).toLocaleDateString('tr-TR')}
Blog: ${post.blog.title}

${formatHtmlToTxt(post.content)}

${'='.repeat(80)}

`;
    }).join('\n');

    // Domain adından geçerli bir dosya adı oluştur
    const sanitizedDomain = credentials.shopifyDomain.replace(/[^a-zA-Z0-9]/g, '-');

    // Dosyayı oluştur ve indir
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-posts-${sanitizedDomain}.txt`;
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
          onExportToTxt={handleExportToTxt}
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
