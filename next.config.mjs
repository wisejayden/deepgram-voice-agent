/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/agent",
  redirects: () => [
    { source: "/", destination: "/agent", permanent: false, basePath: false },
    { source: "/drivethru", destination: "/agent/drivethru", permanent: false, basePath: false },
    { source: "/jitb", destination: "/agent/jitb", permanent: false, basePath: false },
  ],

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
