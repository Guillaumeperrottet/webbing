import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/structured-data";
import { Analytics } from "@vercel/analytics/react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-E7P0FVYQSZ" strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-E7P0FVYQSZ');`}</Script>
    <a href="#main" className="skip-link">Aller au contenu</a>
    <OrganizationSchema /><LocalBusinessSchema /><Header /><main id="main">{children}</main><Footer /><Analytics />
  </>;
}
