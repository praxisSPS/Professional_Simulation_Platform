/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any hostname (for future org logos etc.)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Strict mode for better error detection in development
  reactStrictMode: true,
}

module.exports = nextConfig
