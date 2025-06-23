/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Shopify CDN'den gelen görsellere izin ver
      },
    ],
  },
};

module.exports = nextConfig;
