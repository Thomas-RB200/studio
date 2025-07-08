import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const pwaRunner = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

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

export default process.env.NODE_ENV === 'development'
  ? nextConfig
  : pwaRunner(nextConfig);
