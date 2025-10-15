import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Webbing | Parlons de votre projet",
  description:
    "Contactez Webbing pour discuter de votre projet d'application SaaS. Email, téléphone, ou formulaire de contact. Nous sommes basés à Bulle, Suisse.",
  keywords:
    "contact Webbing, développement SaaS Suisse, agence web Bulle, consultation digitale, développeur Fribourg",
  openGraph: {
    title: "Contact - Webbing | Parlons de votre projet",
    description:
      "Contactez-nous pour discuter de votre projet. Email: gp@webbing.ch, Tel: +41 79 341 40 74",
    url: "https://webbing.ch/contact",
    type: "website",
    locale: "fr_CH",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
