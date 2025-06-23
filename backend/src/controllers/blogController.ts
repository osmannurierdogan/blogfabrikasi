import { Request, Response } from 'express';
import { shopifyService } from '../services/shopifyService';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const { limit = 100, cursor, domain, token, version } = req.query;

    // Initialize Shopify service with provided credentials if available
    if (domain && token) {
      await shopifyService.initialize({
        storeDomain: domain as string,
        storefrontAccessToken: token as string,
        apiVersion: version as string || '2024-01',
      });
    }

    const result = await shopifyService.fetchArticles({
      first: Number(limit),
      after: cursor as string,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
    });
  }
}; 
