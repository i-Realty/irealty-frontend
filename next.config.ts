import type { NextConfig } from "next";

const BACKEND_ORIGIN = process.env.BACKEND_API_ORIGIN ?? 'https://staging-api.i-realty.app';

const nextConfig: NextConfig = {
  distDir: "dist",

  // Proxy /api/* → backend/api/v1/* so the browser never talks directly to the
  // staging API (avoids CORS entirely). The client just calls relative /api/* paths.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'staging-api.i-realty.app',
      },
    ],
  },
};

export default nextConfig;
