/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-icons'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-icons': 'react-icons'
    }
    return config
  }
}

module.exports = nextConfig 