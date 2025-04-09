/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost'],
  },
  // Ensure TypeScript files are properly processed
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `process` being defined
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve('process/browser'),
      };
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      );
    }
    
    return config;
  },
}

module.exports = nextConfig 