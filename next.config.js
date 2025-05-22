/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  // Disable linting during development to speed up startup
  eslint: {
    // Completely ignore ESLint errors during builds (both local and Vercel)
    ignoreDuringBuilds: true,
  },
  // Enable Turbo mode for faster development
  experimental: {
    // Use turbo for faster builds
    turbo: {
      rules: {
        '*.js': ['swc-loader'],
        '*.mjs': ['swc-loader'],
        '*.cjs': ['swc-loader'],
        '*.ts': ['swc-loader'],
        '*.tsx': ['swc-loader'],
      },
    },
    // Only use minimal type checking during development
    typedRoutes: process.env.NODE_ENV === 'production',
    // Optimize compilation
    optimizePackageImports: [
      'react', 'react-dom', 'lucide-react', '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog', '@radix-ui/react-scroll-area'
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Ensure TypeScript files are properly processed
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
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