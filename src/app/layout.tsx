// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { shareImageAlt, siteDescription, siteTitle } from "@/data/site-meta";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Webbing",
  },
  description: siteDescription,
  authors: [{ name: "Guillaume Perrottet", url: "https://webbing.ch" }],
  creator: "Webbing",
  publisher: "Webbing",
  metadataBase: new URL("https://www.webbing.ch"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://www.webbing.ch/",
    siteName: "Webbing",
    locale: "fr_CH",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: shareImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/opengraph-image", alt: shareImageAlt }],
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
