import { config } from '../config/environment';

// Types
interface ShopifyImage {
  url: string;
  altText?: string;
}

interface ShopifyAuthor {
  name: string;
}

interface ShopifyArticle {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  publishedAt: string;
  image?: ShopifyImage;
  author?: ShopifyAuthor;
  blog: {
    title: string;
  };
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface ArticleConnection {
  edges: Array<{
    node: ShopifyArticle;
  }>;
  pageInfo: PageInfo;
}

interface ArticlesResponse {
  data: {
    articles: ArticleConnection;
  };
}

// GraphQL Queries
const ARTICLES_QUERY = `
  query GetArticles($first: Int!, $after: String) {
    articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          id
          title
          excerpt
          content
          publishedAt
          image {
            url
            altText
          }
          author {
            name
          }
          blog {
            title
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export class ShopifyService {
  private static readonly STOREFRONT_API_URL = `https://${config.shopify.storeDomain}/api/${config.shopify.apiVersion}/graphql.json`;

  private static async makeGraphQLRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    try {
      const response = await fetch(this.STOREFRONT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Shopify API error: ${response.statusText}. ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }

  static async getArticles(first: number = 20, after?: string): Promise<{
    articles: ShopifyArticle[];
    pageInfo: PageInfo;
  }> {
    try {
      const response = await this.makeGraphQLRequest<ArticlesResponse>(
        ARTICLES_QUERY,
        { first, after }
      );

      if (!response.data?.articles?.edges) {
        return { articles: [], pageInfo: { hasNextPage: false, endCursor: '' } };
      }

      return {
        articles: response.data.articles.edges.map(edge => edge.node),
        pageInfo: response.data.articles.pageInfo,
      };
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  }

  static async executeQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    return this.makeGraphQLRequest<T>(query, variables);
  }
} 
