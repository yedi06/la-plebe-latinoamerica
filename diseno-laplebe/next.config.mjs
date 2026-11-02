/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  // SSG puro: exporta HTML estático (CDN-friendly, TTFB mínimo).
  output: 'export',
  images: { unoptimized: true },
  // Direcciones sin barra final: laplebelatam.org/donar.
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
