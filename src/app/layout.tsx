// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  OrganizationSchema,
  LocalBusinessSchema,
} from "@/components/seo/structured-data";
import { Analytics } from "@vercel/analytics/react";
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E7P0FVYQSZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E7P0FVYQSZ');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">Aller au contenu</a>
        <OrganizationSchema />
        <LocalBusinessSchema />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
