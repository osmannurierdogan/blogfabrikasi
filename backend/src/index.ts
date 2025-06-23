import express from 'express';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blog', blogRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something broke!',
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
