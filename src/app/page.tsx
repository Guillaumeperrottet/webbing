"use client";

import {
  Hero,
  Section,
  Container,
  FeatureCard,
} from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const values = [
  {
    icon: Shield,
    title: "Sécurité Suisse",
    description:
      "Vos données sont hébergées et protégées selon les standards européens les plus stricts en matière de sécurité et de confidentialité.",
  },
  {
    icon: RefreshCw,
    title: "Évolution Continue",
    description:
      "Nous sommes à l'écoute de vos retours pour améliorer constamment nos applications. Les mises à jour se déploient automatiquement sans interruption.",
  },
  {
    icon: Globe,
    title: "Installation Simplifiée",
    description:
      "Applications web accessibles depuis n'importe quel navigateur, sans installation ni maintenance technique de votre côté.",
  },
];

const applications = [
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "La solution complète pour gérer efficacement vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante.",
    logo: "/logo_app/logo_plannikeeper.png",
    url: "https://www.plannikeeper.ch/",
    color: "orange", // Couleur orange comme sur le site PlanniKeeper
    features: [
      "Visualisation interactive de vos biens immobiliers",
      "Gestion des tâches simplifiée et centralisée",
      "Mode collaboratif en temps réel avec votre équipe",
      "Centralisation documentaire complète",
      "Communication facilitée avec assignation de tâches",
      "Notifications automatiques et historique",
    ],
  },
  {
    name: "Chaff",
    category: "Analytics Business",
    tagline: "Analysez • Modélisez • Décidez",
    description:
      "Plateforme d'analyse business pour transformer vos données en insights stratégiques et prendre des décisions éclairées.",
    logo: "/logo_app/logo_chaff.png",
    url: "https://www.chaff.ch/",
    color: "blue", // Couleur bleue pour l'analytics
    features: [
      "Analytics en temps réel avec graphiques interactifs",
      "Suivi quotidien du chiffre d'affaires",
      "Gestion et analyse de la masse salariale",
      "Calcul des ratios de rentabilité par période",
      "Tableaux de bord intuitifs personnalisables",
      "Chiffrement end-to-end pour la sécurité",
      "Hébergement européen conforme RGPD",
    ],
  },
  {
    name: "SelfKey",
    category: "Check-in automatique",
    tagline: "Enregistrez • Payez • Accédez",
    description:
      "Solution suisse de check-in automatique 24h/24 : vos clients s'enregistrent, paient et accèdent à leur hébergement sans intervention.",
    logo: "/logo_app/logo_selfkey.png",
    url: "https://www.selfkey.ch/",
    color: "gray", // Couleur gris clair pour SelfKey
    features: [
      "Check-in 24h/24 par code QR",
      "Paiement sécurisé Stripe (cartes, TWINT, Apple Pay, Google Pay)",
      "Envoi automatique des codes d'accès par email après paiement",
      "Installation rapide et configuration simple",
      "Basé en Suisse avec conformité RGPD garantie",
      "Interface intuitive pour établissements et clients",
    ],
  },
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "Réservez • Campez • Profitez",
    description:
      "Marque à part entière qui redéfini entièrement la gestion des campings modernes. Née d'une collaboration étroite avec notre client, cette innovation allie technologie, simplicité et design au service du tourisme durable.",
    logo: "/logo_app/logo_selfcamp.png",
    url: "https://www.selfcamp.ch/",
    color: "green", // Couleur verte pour camping/nature
    features: [
      "Des aires de camping modernes et automatisées",
      "Un système d’accès et de paiement sans contact",
      "Une gestion complète et connectée pour les exploitants",
      "Une expérience fluide et sans application pour les voyageurs",
    ],
  },
];

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth * 0.85 + 8; // Ajusté pour gap-2
      const scrollIndex = Math.round(scrollLeft / cardWidth);
      const index = scrollIndex % applications.length;
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section moderne avec shadcn/ui */}
      <Hero
        badge="Développement Web Suisse"
        title={
          <>
            Applications web <span className="text-primary">sur mesure</span>
          </>
        }
        description="Nous créons des applications web personnalisées pour votre entreprise. Développées en Suisse, simples et efficaces."
        primaryAction={{
          label: "Voir nos applications",
          href: "/applications",
        }}
        secondaryAction={{
          label: "Nous contacter",
          href: "/contact",
        }}
      />

      {/* Section Valeurs avec design moderne */}
      <Section variant="muted">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-12">
              Pourquoi choisir Webbing ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-background border border-border rounded-2xl mb-6 shadow-sm">
                  <value.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust By Section avec carousel pleine largeur */}
      <Section className="overflow-hidden">
        {/* Retiré variant="muted" pour fond blanc */}
        <Container>
          <motion.h3
            className="text-center text-3xl font-bold text-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ils nous font confiance
          </motion.h3>
        </Container>

        {/* Carousel pleine largeur qui sort de l'écran */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
          <motion.div
            className="flex gap-16 items-center py-12"
            animate={{ x: [0, -((180 + 64) * 6)] }} // (width + gap) * nombre de logos
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
          >
            {/* Première série de logos */}
            {[
              { src: "/trust/logo-potentille.png", alt: "Potentille" },
              { src: "/trust/lodges.png", alt: "Lodges" },
              { src: "/trust/alpha.png", alt: "Alpha" },
              { src: "/trust/popliving.png", alt: "PopLiving" },
              { src: "/trust/dipiaza.png", alt: "Dipiaza" },
              { src: "/trust/logo-campus.png", alt: "Campus Logo" },
            ].map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center justify-center w-48 h-24"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={90}
                  className="max-h-20 w-auto object-contain transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}

            {/* Duplication pour la continuité */}
            {[
              { src: "/trust/logo-potentille.png", alt: "Potentille" },
              { src: "/trust/lodges.png", alt: "Lodges" },
              { src: "/trust/alpha.png", alt: "Alpha" },
              { src: "/trust/popliving.png", alt: "PopLiving" },
              { src: "/trust/dipiaza.png", alt: "Dipiaza" },
              { src: "/trust/logo-campus.png", alt: "Campus Logo" },
            ].map((logo, idx) => (
              <div
                key={`dup-${idx}`}
                className="flex-shrink-0 flex items-center justify-center w-48 h-24"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={90}
                  className="max-h-20 w-auto object-contain transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}

            {/* Troisième série pour un scroll ultra fluide */}
            {[
              { src: "/trust/logo-potentille.png", alt: "Potentille" },
              { src: "/trust/lodges.png", alt: "Lodges" },
              { src: "/trust/alpha.png", alt: "Alpha" },
              { src: "/trust/popliving.png", alt: "PopLiving" },
              { src: "/trust/dipiaza.png", alt: "Dipiaza" },
              { src: "/trust/logo-campus.png", alt: "Campus Logo" },
            ].map((logo, idx) => (
              <div
                key={`trip-${idx}`}
                className="flex-shrink-0 flex items-center justify-center w-48 h-24"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={90}
                  className="max-h-20 w-auto object-contain transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <Container>
          {/* Transition visuelle douce */}
          <motion.div
            className="w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />
        </Container>
      </Section>

      {/* Applications avec FeatureCard moderne */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nos Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              pour vos demandes
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <FeatureCard
                  title={app.name}
                  description={app.description}
                  logo={app.logo}
                  badge={app.category}
                  href={app.url}
                  external={true}
                  features={app.features}
                  color={app.color}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel with Snap Scrolling */}
          <div className="md:hidden relative">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-2 px-4 -mx-4"
            >
              {/* Beaucoup de répétitions pour un scroll vraiment long */}
              {Array.from({ length: 20 }).flatMap((_, repeatIndex) =>
                applications.map((app, index) => (
                  <div
                    key={`${app.name}-${repeatIndex}-${index}`}
                    className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]"
                  >
                    <FeatureCard
                      title={app.name}
                      description={app.description}
                      logo={app.logo}
                      badge={app.category}
                      href={app.url}
                      external={true}
                      features={app.features}
                      color={app.color}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Indicateurs pastilles */}
            <div className="flex justify-center gap-2 mt-6">
              {applications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      const cardWidth = container.clientWidth * 0.85 + 8;
                      // Scroll vers l'élément le plus proche au centre du carousel
                      const currentScroll = container.scrollLeft;
                      const currentRepeat = Math.floor(
                        currentScroll / (cardWidth * applications.length)
                      );
                      container.scrollTo({
                        left:
                          currentRepeat * (cardWidth * applications.length) +
                          cardWidth * index,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-foreground w-6"
                      : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Aller à ${applications[index].name}`}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto bg-card rounded-3xl p-12 border shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Un projet en tête ?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Discutons-en et créons ensemble votre application.
              </p>

              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
