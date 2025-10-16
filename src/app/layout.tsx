// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  OrganizationSchema,
  LocalBusinessSchema,
} from "@/components/seo/structured-data";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Webbing - Solutions SaaS Suisses | Développement sur mesure",
    template: "%s | Webbing",
  },
  description:
    "Webbing crée des applications SaaS sur mesure pour les entreprises suisses. PlanniKeeper, Chaff, SelfKey, SelfCamp. Développement web moderne à Bulle, Fribourg.",
  keywords:
    "SaaS Suisse, développement web Fribourg, agence digitale Bulle, PlanniKeeper, Chaff, applications sur mesure, Next.js, TypeScript",
  authors: [{ name: "Guillaume Perrottet", url: "https://webbing.ch" }],
  creator: "Webbing",
  publisher: "Webbing",
  metadataBase: new URL("https://webbing.ch"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Webbing - Solutions SaaS Suisses",
    description:
      "Créateur de solutions digitales sur mesure. PlanniKeeper, Chaff, SelfKey, SelfCamp.",
    url: "https://webbing.ch",
    siteName: "Webbing",
    locale: "fr_CH",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Webbing - Solutions SaaS Suisses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webbing - Solutions SaaS Suisses",
    description: "Créateur de solutions digitales sur mesure en Suisse",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "WzPyeXSLl-lnRvEQf03TUyc4gZYfyM4bLeoQGzYpVGQ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <OrganizationSchema />
        <LocalBusinessSchema />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
