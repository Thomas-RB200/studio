import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    // Allow requests from cloud-based development environments
    allowedDevOrigins: ['https://*.cloudworkstations.dev'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
