/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for pdfjs-dist
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
};

export default nextConfig;
