/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
    ECOMMERCE_STORE_URL: process.env.ECOMMERCE_STORE_URL,
    ADMIN_DASHBOARD_URL: process.env.ADMIN_DASHBOARD_URL,
  },
};

export default nextConfig;
