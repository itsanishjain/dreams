/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["overpassip.s3.amazonaws.com", "s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
