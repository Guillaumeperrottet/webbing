import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projets Web - Sites Internet Réalisés",
  description:
    "Découvrez nos réalisations de sites web sur mesure. Portfolio de projets digitaux créés par Webbing : sites vitrines, e-commerce et applications web en Suisse.",
  keywords:
    "portfolio web, sites internet Suisse, création site web Fribourg, projets digitaux, réalisations web, développement sur mesure",
  alternates: {
    canonical: "/projets",
  },
  openGraph: {
    title: "Projets Web - Sites Internet Réalisés | Webbing",
    description:
      "Portfolio de nos réalisations web : sites vitrines, e-commerce et projets digitaux sur mesure.",
    url: "https://webbing.ch/projets",
    type: "website",
  },
};

export default function ProjetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
