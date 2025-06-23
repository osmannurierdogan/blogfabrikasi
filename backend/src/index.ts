import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { ShopifyService } from './services/shopifyService';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/shopify/storefront', async (req, res) => {
  try {
    const { query, variables } = req.body;
    const response = await ShopifyService.executeQuery(query, variables);
    console.log('Shopify API Response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: config.isDevelopment && error instanceof Error ? error.message : undefined
    });
  }
});

app.listen(config.port, () => {
  console.log(`Backend server running at http://localhost:${config.port}`);
  console.log(`Environment: ${config.isDevelopment ? 'Development' : 'Production'}`);
  console.log(`Shopify store: ${config.shopify.storeDomain}`);
  console.log(`API version: ${config.shopify.apiVersion}`);
}); 
