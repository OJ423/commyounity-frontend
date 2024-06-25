/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nt.global.ssl.fastly.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eu-assets.simpleview-europe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eu-assets.simpleview-europe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'letsgopeakdistrict.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'handluggageonly.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'becksidestaithes.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
