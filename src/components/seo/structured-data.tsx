import { studioStructuredData } from "@/lib/site-seo";

/** Server-rendered so crawlers receive the studio's facts in the initial HTML. */
export function StudioStructuredData() {
  return <script id="studio-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studioStructuredData).replace(/</g, "\\u003c") }} />;
}
