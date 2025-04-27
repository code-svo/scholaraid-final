/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-icons'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-icons': 'react-icons'
    }
    return config
  },
  images: {
    domains: [
      'randomuser.me',
      'images.unsplash.com',
      'lh3.googleusercontent.com'
    ],
  },
}

module.exports = nextConfig 