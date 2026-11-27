import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProjectShowcase } from "@/components/project-showcase";
import { ContactLink, ProjectContactLink } from "@/components/project-link";
import { ContactSection } from "@/components/contact-section";
import { StudioBall } from "@/components/studio-ball";

export default function HomePage() {
  return (
    <>
      <StudioBall />
      <section className="home-hero" aria-labelledby="home-title">
        <div className="site-container">
          <p className="home-studio-signature">Studio web indépendant · Bulle, Suisse romande</p>
          <div className="home-intro">
            <h1 id="home-title">Le web,<br />à votre <span className="hero-title-last">mesure<span className="studio-period" data-ball-anchor="hero" aria-hidden="true" /><span className="visually-hidden">.</span></span></h1>
            <div className="home-intro-copy">
              <p>Des sites et des applications sur mesure, pour votre activité.</p>
              <p>Nous concevons et développons votre projet. De la première idée à la mise en ligne, vous échangez directement avec la personne qui le réalise.</p>
              <div className="hero-actions">
                <Button size="lg" asChild><ContactLink section="hero">Parlons de votre projet</ContactLink></Button>
                <a href="#realisations" className="text-link">Découvrir les réalisations</a>
              </div>
            </div>
          </div>
          <div className="home-footnote"><span>Conception & développement</span><a href="#approche">Indépendance</a></div>
        </div>
      </section>

      <ProjectShowcase />

      <div className="site-container clients-container">
        <p className="section-kicker">Quelques collaborations</p>
        <div className="work-clients" aria-label="Quelques collaborations">
          {[
            ["/trust/pattus.svg", "Pattùs Hotel"], ["/trust/logo-potentille.png", "Potentille"],
            ["/trust/lodges.png", "Lodges"], ["/trust/alpha.png", "Alpha Hotel"],
            ["/trust/dipiaza.png", "Dipiaza"], ["/trust/logo-campus.png", "Campus"],
          ].map(([src, name]) => <Image key={src} src={src} alt={name} width={112} height={64} />)}
        </div>
      </div>

      <section id="approche" className="site-section studio-section" aria-labelledby="studio-title">
        <div className="site-container studio-grid">
          <figure className="studio-person">
            <div className="studio-portrait-window"><Image src="/guillaume-avatar.jpeg" alt="Guillaume Perrottet" width={768} height={1024} sizes="594px" /><span className="studio-nose" data-ball-anchor="studio" aria-hidden="true" /></div>
            <figcaption>Guillaume Perrottet <span>Webbing</span></figcaption>
          </figure>
          <div className="studio-copy">
            <p className="section-kicker">Le studio</p>
            <h2 id="studio-title" className="section-heading">Un échange direct.</h2>
            <p>Webbing conçoit et développe des sites et des applications à Bulle, en Suisse romande. Chaque projet part de votre activité, de vos utilisateurs et de ce qui vous serait utile.</p>
            <p>Nous définissons le besoin et les prochaines étapes ensemble. Selon le projet, nous collaborons avec des designers et d’autres créateurs.</p>
            <ProjectContactLink section="studio" />
          </div>
        </div>
      </section>

      <section id="methode" className="site-section method-section" aria-labelledby="method-title">
        <div className="site-container">
          <div className="section-intro"><div><p className="section-kicker"><span className="studio-ball-label">Notre approche<span className="studio-ball-stop" data-ball-anchor="method" aria-hidden="true" /></span></p><h2 id="method-title" className="section-heading">Votre métier donne le ton.</h2></div><p>Un projet à votre mesure,<br />des choix que l’on fait ensemble.</p></div>
          <dl className="studio-method">
            <div><dt>Comprendre</dt><dd>Votre activité, vos clients, vos habitudes. Nous définissons le besoin avant de choisir la solution.</dd></div>
            <div><dt>Concevoir & réaliser</dt><dd>Les contenus, les parcours, les fonctions : nous construisons votre site ou votre application autour de votre usage.</dd></div>
            <div><dt>Mettre en ligne</dt><dd>Nous préparons le lancement avec vous, pour que vous puissiez prendre en main votre site ou votre application.</dd></div>
          </dl>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
