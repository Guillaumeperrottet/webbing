import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications - Webbing | PlanniKeeper, Chaff, SelfKey, SelfCamp",
  description:
    "Découvrez nos applications SaaS : PlanniKeeper pour l'immobilier, Chaff pour l'analytics, SelfKey pour les check-ins et SelfCamp pour les campings. Solutions suisses innovantes.",
  keywords:
    "PlanniKeeper, Chaff analytics, SelfKey, SelfCamp, gestion immobilière, business intelligence, check-in automatique, SaaS Suisse",
  openGraph: {
    title: "Nos Applications - Webbing",
    description:
      "PlanniKeeper, Chaff, SelfKey et SelfCamp : des solutions SaaS innovantes pour votre business.",
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
