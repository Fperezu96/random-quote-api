// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
      return [
            {
                    source: '/',
                            destination: '/api/quotes',
                                    permanent: false, // o true si quieres que sea un redireccionamiento permanente (301)
                                          },
                                              ];
                                                },
                                                };

                                                module.exports = nextConfig;
                                                