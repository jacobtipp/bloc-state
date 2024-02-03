/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/posts?id=9001',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
