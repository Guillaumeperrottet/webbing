import { permanentRedirect } from "next/navigation";

// Preserve bookmarked URLs; the complete content now lives on the homepage.
export default function LegacyPage() {
  permanentRedirect("/#selfcamp");
}
