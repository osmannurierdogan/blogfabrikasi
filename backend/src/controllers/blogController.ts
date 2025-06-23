import { Request, Response } from 'express';
import { shopifyService } from '../services/shopifyService';

export class BlogController {
  static async getArticles(req: Request, res: Response) {
    try {
      const { limit = 20, cursor } = req.query;
      
      const result = await shopifyService.fetchArticles({
        first: Number(limit),
        after: cursor as string | undefined,
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
  }
} 
