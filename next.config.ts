import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      { source: "/applications", destination: "/#selfcamp", permanent: true },
      { source: "/projets", destination: "/#realisations", permanent: true },
      { source: "/about", destination: "/#approche", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
