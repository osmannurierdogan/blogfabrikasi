import { Request, Response } from 'express';
import { ShopifyService } from '../services/shopifyService';

export class BlogController {
  static async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20', cursor } = req.query;
      const pageSize = Math.min(parseInt(limit as string, 10), 50); // Maximum 50 articles per request

      const { articles, pageInfo } = await ShopifyService.getArticles(pageSize, cursor as string);

      res.json({
        success: true,
        data: {
          articles,
          pageInfo,
        },
      });
    } catch (error) {
      console.error('Error in getArticles:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
      });
    }
  }
} 
