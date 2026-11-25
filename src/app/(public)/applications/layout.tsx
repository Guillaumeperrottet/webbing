import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications | Wisp, Selfcamp, Mypapers, OpenWind",
  description:
    "Découvrez nos applications : Wisp pour les fichiers, Selfcamp pour les aires de camping-car, Mypapers pour les notes et projets, et OpenWind pour le vent.",
  keywords:
    "Wisp, Selfcamp, Mypapers, OpenWind, fichiers, notes, projets, établissements, camping, vent, applications web Suisse",
  alternates: {
    canonical: "/applications",
  },
  openGraph: {
    title: "Nos Applications - Webbing",
    description:
      "Wisp, Selfcamp, Mypapers et OpenWind : des solutions concrètes pour votre activité, sur le web et sur iPhone.",
    url: "https://webbing.ch/applications",
    type: "website",
    locale: "fr_CH",
  },
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
