/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pull-one-axoria-blog-test.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
