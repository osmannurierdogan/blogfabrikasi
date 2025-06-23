import httpClient from './httpClient';

// Types
export interface BlogImage {
  url: string;
  altText?: string;
}

export interface BlogAuthor {
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  publishedAt: string;
  image?: BlogImage;
  author?: BlogAuthor;
  blog: {
    title: string;
  };
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface BlogPostsResponse {
  articles: BlogPost[];
  pageInfo: PageInfo;
}

// Constants
const API_ENDPOINTS = {
  ARTICLES: '/api/blog/articles',
} as const;

// Service
export class BlogService {
  static async fetchBlogPosts(first: number = 20, after?: string): Promise<{ posts: BlogPost[], hasNextPage: boolean, endCursor: string }> {
    try {
      const params = {
        limit: first,
        ...(after && { cursor: after }),
      };

      const result = await httpClient.get<never, ApiResponse<BlogPostsResponse>>(
        API_ENDPOINTS.ARTICLES,
        { params }
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch blog posts');
      }

      return {
        posts: result.data.articles,
        hasNextPage: result.data.pageInfo.hasNextPage,
        endCursor: result.data.pageInfo.endCursor,
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }
} 
