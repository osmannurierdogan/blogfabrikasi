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
  ARTICLES: 'http://localhost:3001/api/blog/articles',
} as const;

// Service
export class BlogService {
  static async fetchBlogPosts(first: number = 20, after?: string): Promise<{ posts: BlogPost[], hasNextPage: boolean, endCursor: string }> {
    try {
      const params = new URLSearchParams({
        limit: first.toString(),
        ...(after && { cursor: after }),
      });

      const response = await fetch(`${API_ENDPOINTS.ARTICLES}?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }

      const result: ApiResponse<BlogPostsResponse> = await response.json();

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

export type { BlogPost }; 
