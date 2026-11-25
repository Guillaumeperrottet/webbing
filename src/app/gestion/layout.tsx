import type { Metadata } from "next";
import "./gestion.css";
export const metadata: Metadata = { title: "Gestion privée", description: "Espace privé de supervision Webbing.", alternates: { canonical: null }, robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noimageindex: true } } };
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function GestionLayout({ children }: { children: React.ReactNode }) { return <main id="main" className="ops">{children}</main>; }
