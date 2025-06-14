// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Webbing - Solutions SaaS Suisses",
  description:
    "Découvrez PlanniKeeper et Chaff, nos solutions SaaS innovantes pour la gestion immobilière et l'analyse business.",
  keywords:
    "SaaS, gestion immobilière, analytics, business intelligence, Suisse",
  authors: [{ name: "Webbing" }],
  openGraph: {
    title: "Webbing - Solutions SaaS Suisses",
    description:
      "Solutions SaaS innovantes pour la gestion immobilière et l'analyse business",
    url: "https://webbing.ch",
    siteName: "Webbing",
    locale: "fr_CH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
