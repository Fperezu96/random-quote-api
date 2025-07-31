/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/quotes',
        permanent: true, 
      },
    ];
  },
};
module.exports = nextConfig;
