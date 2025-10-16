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
import { WaveSeparator } from "@/components/ui/wave-separator";
import { track } from "@vercel/analytics";

const values = [
  {
    icon: RefreshCw,
    title: "Évolution continue",
    description:
      "Nous sommes à l'écoute de vos retours et utilisons des frameworks modernes pour évoluer aussi rapidement qu'internet.",
  },
  {
    icon: Globe,
    title: "Installation simplifiée",
    description:
      "Applications web accessibles depuis n'importe quel navigateur, sans installation ni maintenance technique de votre côté.",
  },
  {
    icon: Shield,
    title: "Sécurité Suisse",
    description:
      "Vos données sont hébergées et protégées selon les standards européens les plus stricts en matière de sécurité et de confidentialité.",
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
      {/* Image de fond avec vague blanche */}
      <WaveSeparator
        imageSrc="/background_accueil.jpg"
        imageAlt="Webbing - Applications web sur mesure"
        imageHeight={600}
        fillColor="#ffffff"
        className="mb-0"
      />

      {/* Hero Section moderne avec shadcn/ui - Remonté avec marge négative et z-index */}
      <div className="relative z-10 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 xl:-mt-45">
        <Hero
          badge="Développement Web Suisse"
          title={
            <Image
              src="/webbing_informatique.png"
              alt="Webbing Informatique"
              width={300}
              height={100}
              className="mx-auto"
              priority
            />
          }
          description="Nous créons des applications et sites web personnalisés pour votre entreprise. Développés en Suisse, simples et efficaces."
          // primaryAction={{
          //   label: "Voir nos applications",
          //   href: "/applications",
          // }}
          // secondaryAction={{
          //   label: "Nous contacter",
          //   href: "/contact",
          // }}
        />
      </div>

      {/* Applications avec FeatureCard moderne */}
      <Section className="pt-36">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-display">
              Nos Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              à vos demandes
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

      {/* Trust By Section avec carousel pleine largeur */}
      <Section className="overflow-hidden">
        {/* Retiré variant="muted" pour fond blanc */}
        <Container>
          <motion.h3
            className="text-center text-3xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ils nous font confiance
          </motion.h3>
        </Container>

        {/* Carousel pleine largeur qui sort de l'écran */}
        <div className="relative w-screen left-1/2 -translate-x-1/2">
          {/* Version mobile : animation automatique */}
          <div className="md:hidden overflow-hidden">
            <motion.div
              className="flex gap-8 items-center py-12"
              animate={{ x: [0, -((160 + 32) * 6)] }} // (width + gap) * nombre de logos
              transition={{
                repeat: Infinity,
                duration: 15,
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
                  className="flex-shrink-0 flex items-center justify-center w-40 h-20"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={80}
                    className="max-h-16 w-auto object-contain opacity-70"
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
                  className="flex-shrink-0 flex items-center justify-center w-40 h-20"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={80}
                    className="max-h-16 w-auto object-contain opacity-70"
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
                  className="flex-shrink-0 flex items-center justify-center w-40 h-20"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={80}
                    className="max-h-16 w-auto object-contain opacity-70"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Version desktop : animation automatique */}
          <div className="hidden md:block overflow-hidden">
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
        </div>
      </Section>

      {/* Section Valeurs avec design moderne et sobre */}
      <Section>
        <Container>
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
                Pourquoi choisir Webbing ?
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative rounded-2xl p-6 md:p-8 h-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2">
                  {/* Icône avec effet hover */}
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300 font-display">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm font-body">
                    {value.description}
                  </p>

                  {/* Bordure décorative au hover */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                </div>
              </motion.div>
            ))}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
                Un projet en tête ?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-body">
                Discutons-en et créons ensemble vos idées.
              </p>

              <Button
                size="lg"
                className="text-base px-8"
                asChild
                onClick={() =>
                  track("CTA Click", {
                    section: "homepage",
                    action: "contact_button",
                  })
                }
              >
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
