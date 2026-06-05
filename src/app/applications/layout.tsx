import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications | Wisp, SelfCamp, PlanniKeeper, OpenWind",
  description:
    "Découvrez nos applications web : Wisp pour le cloud suisse, SelfCamp pour les campings, PlanniKeeper pour l'immobilier et OpenWind pour les sports de vent.",
  keywords:
    "Wisp, SelfCamp, PlanniKeeper, OpenWind, cloud suisse, gestion immobilière, camping automatisé, sports de vent, applications web Suisse",
  alternates: {
    canonical: "/applications",
  },
  openGraph: {
    title: "Nos Applications - Webbing",
    description:
      "Wisp, SelfCamp, PlanniKeeper et OpenWind : des solutions web concrètes, hébergées en Suisse.",
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
