import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: envFile });

export const config = {
  port: process.env.PORT || 3001,
  shopify: {
    domain: process.env.SHOPIFY_STORE_DOMAIN,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  },
} as const; 
