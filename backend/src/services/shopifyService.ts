import { config } from '../config/environment';

interface ShopifyConfig {
  storeDomain: string;
  apiVersion: string;
  storefrontAccessToken: string;
}

interface FetchArticlesParams {
  first?: number;
  after?: string;
}

interface BlogImage {
  url: string;
  altText?: string;
}

interface BlogAuthor {
  name: string;
}

interface BlogPost {
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

interface ArticlesResponse {
  articles: BlogPost[];
  pageInfo: PageInfo;
}

class ShopifyServiceClass {
  private client: any;

  constructor(config: ShopifyConfig) {
    this.initialize(config);
  }

  public async initialize(config: ShopifyConfig) {
    const { GraphQLClient } = await import('graphql-request');
    this.client = new GraphQLClient(`https://${config.storeDomain}/api/${config.apiVersion}/graphql`, {
      headers: {
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchArticles({ first = 100, after }: FetchArticlesParams = {}): Promise<ArticlesResponse> {
    if (!this.client) {
      throw new Error('ShopifyService not initialized');
    }

    const query = `
      query GetAllBlogArticles($first: Int!, $after: String) {
        blogs(first: 10) {
          edges {
            node {
              title
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
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      }
    `;

    try {
      const variables = {
        first,
        after: after || null
      };

      const data = await this.client.request(query, variables);
      
      // Combine articles from all blogs
      const allArticles = data.blogs.edges.reduce((acc: any[], blogEdge: any) => {
        const articles = blogEdge.node.articles.edges.map((articleEdge: any) => ({
          ...articleEdge.node,
          blog: {
            title: blogEdge.node.title
          }
        }));
        return [...acc, ...articles];
      }, []);

      // Sort all articles by publishedAt date
      const sortedArticles = allArticles.sort((a: BlogPost, b: BlogPost) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      // Get combined pageInfo
      const hasNextPage = data.blogs.edges.some((blogEdge: any) => 
        blogEdge.node.articles.pageInfo.hasNextPage
      );
      
      const endCursor = hasNextPage 
        ? data.blogs.edges.find((blogEdge: any) => 
            blogEdge.node.articles.pageInfo.hasNextPage
          )?.node.articles.pageInfo.endCursor 
        : '';

      return {
        articles: sortedArticles,
        pageInfo: {
          hasNextPage,
          endCursor
        }
      };
    } catch (error) {
      console.error('Error fetching articles from Shopify:', error);
      throw new Error('Failed to fetch articles from Shopify');
    }
  }
}

// Create and export a singleton instance
export const shopifyService = new ShopifyServiceClass({
  storeDomain: config.shopify.domain || '',
  storefrontAccessToken: config.shopify.storefrontAccessToken || '',
  apiVersion: config.shopify.apiVersion,
}); 
