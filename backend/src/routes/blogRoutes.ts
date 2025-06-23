import { Router } from 'express';
import { BlogController } from '../controllers/blogController';

const router = Router();

router.get('/articles', BlogController.getArticles);

export default router; 
