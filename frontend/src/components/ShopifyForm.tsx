'use client';

import { useState } from 'react';

interface ShopifyFormProps {
  onSubmit: (credentials: {
    shopifyDomain: string;
    accessToken: string;
    apiVersion?: string;
  }) => void;
  onFetchPosts: () => Promise<void>;
  onExportToJsonl?: () => Promise<void>;
}

export default function ShopifyForm({ onSubmit, onFetchPosts, onExportToJsonl }: ShopifyFormProps) {
  const [formData, setFormData] = useState({
    shopifyDomain: '',
    accessToken: '',
    apiVersion: '2024-01', // Varsayılan değer
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      shopifyDomain: formData.shopifyDomain,
      accessToken: formData.accessToken,
      apiVersion: formData.apiVersion || undefined,
    });
    await onFetchPosts();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Shopify Blog Görüntüleyici</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex-1">
            <label htmlFor="shopifyDomain" className="block text-sm font-semibold text-gray-700 mb-2">
              Shopify Domain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopifyDomain"
              name="shopifyDomain"
              value={formData.shopifyDomain}
              onChange={handleChange}
              placeholder="your-store.myshopify.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="accessToken" className="block text-sm font-semibold text-gray-700 mb-2">
              Storefront Access Token <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="accessToken"
              name="accessToken"
              value={formData.accessToken}
              onChange={handleChange}
              placeholder="shpat_xxxxx..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* API Version field is hidden and uses default value */}
        <input
          type="hidden"
          name="apiVersion"
          value={formData.apiVersion}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm shadow-sm"
          >
            Blog Yazılarını Getir
          </button>

          <button
            type="button"
            onClick={onExportToJsonl}
            disabled={!onExportToJsonl}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            JSONL Olarak İndir
          </button>
        </div>
      </form>
    </div>
  );
} 
