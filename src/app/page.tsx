"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";

const trustLogos = [
  { src: "/trust/pattus.svg", alt: "Pattùs Hotel" },
  { src: "/trust/logo-potentille.png", alt: "Potentille" },
  { src: "/trust/lodges.png", alt: "Lodges" },
  { src: "/trust/alpha.png", alt: "Alpha" },
  { src: "/trust/popliving.png", alt: "PopLiving" },
  { src: "/trust/dipiaza.png", alt: "Dipiaza" },
  { src: "/trust/logo-campus.png", alt: "Campus Logo" },
] as const;

const services = [
  { name: "Applications Web", category: "Votre programme", image: "/selfcamp_accueil.png", imageAlt: "SelfCamp, réservation d’aires de camping-car", url: "/applications#selfcamp", description: "SelfCamp, notre application pour créer des aires de camping-car : réservation et paiement en ligne. Une solution pour les communes, les régions et les vanlifers, en collaboration avec l’Union fribourgeoise du Tourisme." },
  { name: "Sites Internet", category: "Vitrines & Portfolios", image: "/projects/pattus_projet.jpg", imageAlt: "Pattùs Hotel, site internet multilingue", url: "/projets#pattus-hotel", description: "Pattùs Hotel, un site multilingue pour présenter les chambres, le restaurant et les événements, avec réservation en ligne." },
];

function OpenWindImages() {
  const [swapped, setSwapped] = useState(false);
  const front = swapped ? "/openwind_accueil.png" : "/openwind_planif_accueil.png";
  const back = swapped ? "/openwind_application.png" : "/openwind_accueil.png";
  return (
    <div>
      <button
        type="button"
        className="work-switcher"
        aria-label="Changer la vue d’OpenWind"
        aria-pressed={swapped}
        onMouseEnter={() => setSwapped(true)}
        onMouseLeave={() => setSwapped(false)}
        onClick={() => setSwapped((value) => !value)}
      >
        <Image src={front} alt={swapped ? "OpenWind, prévisions vent 7 jours" : "OpenWind, application spots et prévisions vent"} width={1400} height={900} sizes="(max-width: 639px) 100vw, 50vw" />
        <span>Changer de vue</span>
      </button>
      <Image src={back} alt={swapped ? "OpenWind, application spots et prévisions vent" : "OpenWind, prévisions vent 7 jours"} width={1400} height={900} className="mt-3 h-auto w-2/5 rounded-md border border-border" sizes="(max-width: 639px) 40vw, 20vw" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <Image
          src="/lac-gruyere.jpg"
          alt="Le lac de la Gruyère, en Suisse"
          fill
          priority
          sizes="100vw"
        />
        <div className="site-container home-hero-content">
          <h1 id="home-title">Sites et applications web sur mesure</h1>
          <p>À Bulle, nous créons les outils web adaptés à votre activité.</p>
          <div className="hero-actions">
            <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-secondary">
              <Link href="/contact">Parlons de votre projet</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hero-secondary">
              <Link href="/projets">Voir nos réalisations</Link>
            </Button>
          </div>
          <button
            type="button"
            className="mt-10 inline-flex min-h-11 items-center gap-3 rounded-sm text-sm underline underline-offset-4"
            onClick={() => document.getElementById("solutions")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
          >
            Découvrir nos services
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="site-section" id="solutions">
        <div className="site-container">
          <h2 className="section-heading">Votre activité, votre solution web.</h2>
          <div className="service-grid">
            {services.map((service) => (
              <article key={service.name} className="service-item">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <Link href={service.url} className="inline-flex min-h-11 items-center gap-3 rounded-sm font-medium underline underline-offset-4"
                  onClick={() => track("Application Click", { app: service.name, category: service.category })}>
                  {service.name === "Sites Internet" ? "Découvrir Pattùs Hotel" : "Découvrir SelfCamp"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Image src={service.image} alt={service.imageAlt} width={1200} height={750} sizes="(max-width: 639px) 100vw, 50vw" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-band" aria-label="Ils nous font confiance">
        <div className="site-container trust-logos">
          {trustLogos.map((logo) => <Image key={logo.src} src={logo.src} alt={logo.alt} width={112} height={64} />)}
        </div>
      </section>

      <section className="site-section selfcamp-feature">
        <div className="site-container selfcamp-grid">
          <div>
            <h2 className="section-heading">SelfCamp</h2>
            <p>Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers. En partenariat avec l’UFT.</p>
            <Button size="lg" asChild><Link href="https://www.selfcamp.ch/" onClick={() => track("Application Click", { app: "SelfCamp", category: "Self check-in" })}>Découvrir SelfCamp<ExternalLink aria-hidden="true" /></Link></Button>
            <div className="relative mt-8 h-20 w-40"><Image src="/UFT.gif" alt="Partenariat UFT" width={175} height={400} unoptimized className="absolute left-1/2 top-1/2 h-auto w-16 max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90" /></div>
          </div>
          <Image src="/selfcamp_accueil.png" alt="SelfCamp, réservation d’aires de camping-car" width={1500} height={960} className="selfcamp-image" sizes="(max-width: 959px) 100vw, 50vw" />
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <h2 className="section-heading">Dernières réalisations</h2>
          <div className="work-grid">
            <article>
              <OpenWindImages />
              <h3>OpenWind</h3>
              <p>Plateforme communautaire et open-source dédiée aux passionnés de kitesurf, wing ou parapente. Découvrez les meilleurs spots, consultez les prévisions de vent en temps réel et testez le module de planification pour trouver le vent idéal pour vos sessions.</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild><Link href="https://www.openwind.ch/" target="_blank" rel="noopener noreferrer">Visiter openwind.ch<ExternalLink aria-hidden="true" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/applications">Toutes nos applications</Link></Button>
              </div>
            </article>
            <article>
              <Image src="/projects/pattus_projet.jpg" alt="Pattùs Hotel, site internet" width={1570} height={892} className="work-image" sizes="(max-width: 639px) 100vw, 50vw" />
              <h3>Pattùs Hotel</h3>
              <p>Site multilingue pour Pattùs Hotel, un hôtel contemporain au bord du lac de Neuchâtel. Une expérience éditoriale immersive pour présenter les chambres, le restaurant, les événements et la réservation en ligne.</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild><Link href="https://www.pattushotel.ch/fr" target="_blank" rel="noopener noreferrer">Visiter pattushotel.ch<ExternalLink aria-hidden="true" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/projets">Tous nos projets</Link></Button>
              </div>
            </article>
          </div>
        </div>
      </section>


    </>
  );
}
