import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProjectShowcase } from "@/components/project-showcase";
import { ContactLink, ProjectContactLink } from "@/components/project-link";
import { ContactSection } from "@/components/contact-section";
import { SectionArrival } from "@/components/section-arrival";

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="site-container">
          <div className="home-intro">
            <h1 id="home-title">Sites et applications<br className="desktop-break" /> pensés pour votre activité.</h1>
            <div className="home-intro-copy">
              <p>À Bulle, un accompagnement direct, de l’idée à la mise en ligne.</p>
              <div className="hero-actions">
                <Button size="lg" asChild><ContactLink section="hero">Parlons de votre projet</ContactLink></Button>
                <a href="#realisations" className="text-link">Voir les réalisations</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectShowcase />

      <div className="site-container clients-container">
        <div className="work-clients" aria-label="Quelques collaborations">
          {[
            ["/trust/pattus.svg", "Pattùs Hotel"], ["/trust/logo-potentille.png", "Potentille"],
            ["/trust/lodges.png", "Lodges"], ["/trust/alpha.png", "Alpha Hotel"],
            ["/trust/dipiaza.png", "Dipiaza"], ["/trust/logo-campus.png", "Campus"],
          ].map(([src, name]) => <Image key={src} src={src} alt={name} width={112} height={64} />)}
        </div>
      </div>

      <section id="approche" className="site-section approach-section" aria-labelledby="approach-title">
        <div className="site-container">
          <SectionArrival className="approach-grid">
          <div className="approach-copy">
            <h2 id="approach-title" className="section-heading">Du besoin au lancement.</h2>
            <p>Nous créons votre solution autour de votre activité, avec un échange direct à chaque étape.</p>
            <div className="founder-signature">
              <span className="founder-avatar">
                <Image src="/guillaume-avatar.jpeg" alt="Guillaume Perrottet" width={768} height={1024} sizes="264px" />
              </span>
              <div><p className="founder-name">Guillaume Perrottet</p><p>Webbing, à Bulle.</p></div>
            </div>
            <ProjectContactLink section="approche" />
          </div>
            <dl className="approach-values">
              <div><dt>Votre besoin d’abord</dt><dd>Présenter votre activité, recevoir des réservations ou réunir vos outils : nous partons de ce qui vous serait utile.</dd></div>
              <div><dt>Un échange direct</dt><dd>Nous précisons ensemble votre besoin et vous accompagnons à chaque étape du projet.</dd></div>
              <div><dt>Jusqu’à la mise en ligne</dt><dd>Nous développons votre site ou votre application et vous accompagnons lors de son lancement.</dd></div>
            </dl>
          </SectionArrival>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
