import { Button } from "@/components/ui/button";
import { BarChart3, Target, Globe, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section className="page-intro">
        <div className="site-container grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <h1 className="page-title">À propos</h1>
            <p className="page-lead">Nous créons des applications et sites internet modernes qui grandissent avec votre entreprise.</p>
          </div>
          <Image src="/background_about.jpg" alt="À propos de Webbing" width={1000} height={600} priority sizes="(max-width: 767px) 100vw, 40vw" className="aspect-[2/1] w-full rounded-lg object-cover" />
        </div>
      </section>
      <section className="site-section">
        <div className="site-container grid items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <Image src="/guillaume-perrottet.jpg" alt="Guillaume Perrottet" width={600} height={700} className="mx-auto h-auto w-full max-w-md rounded-lg object-cover" />
          <div className="min-w-0">
            <h2 className="section-heading">Guillaume Perrottet</h2>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">Né d&apos;un constat simple : internet évolue vite, trop vite pour les solutions figées. Webbing développe des applications et sites internet modernes qui grandissent avec votre entreprise et suivent le rythme de l&apos;innovation.</p>
            <dl className="my-8 space-y-5">
              {[
                { icon: Target, title: "Sur mesure", desc: "Chaque projet est unique, chaque solution est adaptée." },
                { icon: Shield, title: "Proximité", desc: "Communication directe et transparente à chaque étape." },
                { icon: Globe, title: "Innovation", desc: "Technologies modernes, hébergées en Suisse." },
                { icon: BarChart3, title: "Accompagnement", desc: "De l'idée au lancement, et bien au-delà." },
              ].map((value) => (
                <div key={value.title} className="flex items-start gap-4">
                  <value.icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" />
                  <div><dt className="font-medium">{value.title}</dt><dd className="mt-1 text-base text-muted-foreground">{value.desc}</dd></div>
                </div>
              ))}
            </dl>
            <Button size="lg" asChild><Link href="/contact">Nous contacter<ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
