/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_UNSPLASH_API_KEY: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
    NEXT_PUBLIC_UNSPLASH_SECRET: process.env.NEXT_PUBLIC_UNSPLASH_SECRET,
    NEXT_PUBLIC_IMAGE_HOST: process.env.NEXT_PUBLIC_IMAGE_HOST,
  },
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'comyounity-image-storage.s3.eu-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port:'',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
