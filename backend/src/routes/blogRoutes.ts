import { Router } from 'express';
import { getArticles } from '../controllers/blogController';

const router = Router();

router.get('/articles', getArticles);

export default router; 
