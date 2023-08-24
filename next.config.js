/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  output: "standalone", // comment this out in run dev, uncomment when deploy docker
};

module.exports = nextConfig;

/**
npm run build
docker build -t crossfire .

 * 
 * 
 */
