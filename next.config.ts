import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/punctuations",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/0xA5A5",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://x.com/0xA5A5",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/R3QtA68Cbf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
