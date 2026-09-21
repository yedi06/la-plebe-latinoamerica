/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG puro: exporta HTML estático (CDN-friendly, TTFB mínimo).
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
