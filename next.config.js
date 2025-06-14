/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['books.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
    ],
  },
};

module.exports = nextConfig;
