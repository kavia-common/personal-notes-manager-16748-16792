const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
      '@/lib': path.join(__dirname, 'src/lib'),
      '@/components': path.join(__dirname, 'src/components'),
    };
    return config;
  },
};

module.exports = nextConfig;
