import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/punctuations",
        permanent: true,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/1096bit",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://x.com/1096bit",
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
