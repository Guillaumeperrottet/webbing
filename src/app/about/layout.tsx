import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Créateur de solutions digitales sur mesure",
  description:
    "Découvrez Webbing : développement d'applications web et sites internet sur mesure en Suisse. Technologies modernes, proximité client, innovation et accompagnement personnalisé.",
  keywords:
    "développement web Suisse, agence web Fribourg, développeur Bulle, Next.js, TypeScript, applications sur mesure",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "À propos - Webbing | Créateur de solutions digitales",
    description:
      "Webbing crée des solutions sur mesure pour transformer vos idées en applications concrètes.",
    url: "https://webbing.ch/about",
    type: "website",
    locale: "fr_CH",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
