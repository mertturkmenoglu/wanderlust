// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "source.unsplash.com",
        pathname: "/*",
        port: "",
      },
    ],
  },
};

export default nextConfig;
