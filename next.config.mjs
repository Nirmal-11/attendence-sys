/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// Load environment variables from .env.local for development
dotenv.config();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  env: {
    MONGO_URL_DEV: process.env.MONGO_URL_DEV,
    MONGO_URL_PROD: process.env.MONGO_URL_PROD,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;

  