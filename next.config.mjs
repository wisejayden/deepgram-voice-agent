/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/agent",
  redirects: () => [{ source: "/", destination: "/agent", permanent: false, basePath: false }],

  // Add SSR configuration
  reactStrictMode: true,
  transpilePackages: ["@lottiefiles/react-lottie-player"],

  // Add webpack configuration
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.deepgram.com",
        port: "",
        pathname: "/examples/avatars/**",
      },
    ],
  },
};

export default nextConfig;
