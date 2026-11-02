import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Créateur de solutions digitales sur mesure",
  description:
    "Nous développons des applications web et des sites internet sur mesure en Suisse, avec un accompagnement personnalisé et une communication directe.",
  keywords:
    "développement web Suisse, agence web Fribourg, développeur Bulle, Next.js, TypeScript, applications sur mesure",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "À propos - Webbing | Créateur de solutions digitales",
    description:
      "Nous créons des solutions sur mesure pour transformer vos idées en applications concrètes.",
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
