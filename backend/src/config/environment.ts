import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env')
});

interface EnvironmentConfig {
  port: number;
  shopify: {
    storeDomain: string;
    apiVersion: string;
    accessToken: string;
  };
  isDevelopment: boolean;
}

function validateEnvironment(): EnvironmentConfig {
  const missingVars: string[] = [];
  
  // Required environment variables
  const requiredVars = {
    'SHOPIFY_STORE_DOMAIN': process.env.SHOPIFY_STORE_DOMAIN,
    'SHOPIFY_STOREFRONT_API_VERSION': process.env.SHOPIFY_STOREFRONT_API_VERSION,
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  };

  // Check for missing variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) missingVars.push(key);
  });

  // If any required variables are missing, throw an error
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map(v => `- ${v}`).join('\n')}`
    );
  }

  return {
    port: parseInt(process.env.PORT || '3001', 10),
    shopify: {
      storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
      apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION!,
      accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    isDevelopment: process.env.NODE_ENV !== 'production'
  };
}

export const config = validateEnvironment(); 
