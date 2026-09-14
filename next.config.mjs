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
  basePath: process.env.GITHUB_PAGES === 'true' ? '/lexiassist' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/lexiassist/' : '',
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  trailingSlash: process.env.GITHUB_PAGES === 'true' ? true : false,
  images: {
    unoptimized: true,
  },
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
};

export default nextConfig;
