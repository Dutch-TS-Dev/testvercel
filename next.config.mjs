/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "github.com" }],
  },
};

export default nextConfig;
