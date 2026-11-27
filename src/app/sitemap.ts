import type { MetadataRoute } from "next";
import { publicContentUpdatedAt, siteUrl } from "@/data/site-meta";
import { sitemapImages } from "@/lib/site-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Section fragments and legacy redirects are not separate indexable pages.
  return [{ url: siteUrl, lastModified: publicContentUpdatedAt, images: sitemapImages }];
}
