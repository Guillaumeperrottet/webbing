import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    "/api/gestion/agent": ["./scripts/gestion/synology-agent.py"],
    "/gestion/**": ["./config/webbing-ops-ca.crt"],
    "/api/gestion/**": ["./config/webbing-ops-ca.crt"],
  },
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'" },
    ];
    return [
      { source: "/gestion/:path*", headers: privateHeaders },
      { source: "/api/gestion/:path*", headers: privateHeaders },
    ];
  },
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
