/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Replit environment configuration - allow all hosts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
  // Allow all origins for Replit environment
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/$1',
      },
    ];
  },
}

export default nextConfig
