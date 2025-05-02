/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['example.com', 'www.missintercontinental.de'],
      unoptimized: true
    },
    eslint: {
      ignoreDuringBuilds: true  // This will allow the build to complete despite warnings
    }
  }

export default nextConfig;
