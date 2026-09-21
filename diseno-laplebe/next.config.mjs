/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  // SSG puro: exporta HTML estático (CDN-friendly, TTFB mínimo).
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
