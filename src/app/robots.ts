import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site-meta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/gestion", "/gestion/"],
    },
    sitemap: `${siteUrl}sitemap.xml`,
  };
}
