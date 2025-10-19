"use client";

import { Hero, Section, Container } from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaveSeparator } from "@/components/ui/wave-separator";
import {
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

const applications = [
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "Gestion efficace de vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante.",
    testimonial:
      "Nous gérions plusieurs biens immobiliers avec des feuilles Excel et des emails dispersés. Nous cherchions une solution centralisée pour organiser nos tâches, suivre l'avancement des travaux et faciliter la communication avec nos équipes. Webbing a développé PlanniKeeper, une plateforme intuitive qui nous permet aujourd'hui de gérer efficacement tous nos biens depuis une seule interface.",
    logo: "/logo_app/logo_plannikeeper.png",
    url: "https://www.plannikeeper.ch/",
    color: "orange",
  },
  {
    name: "Chaff",
    category: "Analytics Business",
    tagline: "Analysez • Modélisez • Décidez",
    description:
      "Plateforme d'analyse business pour transformer vos données en insights stratégiques et prendre des décisions éclairées.",
    testimonial:
      "Notre restaurant générait beaucoup de données mais nous manquions d'outils pour les analyser efficacement. Nous avions besoin de suivre notre chiffre d'affaires quotidien, analyser notre masse salariale et calculer nos ratios de rentabilité. Webbing a créé Chaff, une plateforme qui nous offre des tableaux de bord clairs et des analyses en temps réel pour piloter notre activité avec précision.",
    logo: "/logo_app/logo_chaff.png",
    url: "https://www.chaff.ch/",
    color: "blue",
  },
  {
    name: "SelfKey",
    category: "Check-in automatique",
    tagline: "Enregistrez • Payez • Accédez",
    description:
      "Solution de check-in automatique 24h/24 : vos clients s'enregistrent, paient et accèdent à leur hébergement sans intervention.",
    testimonial:
      "Notre établissement recevait des clients à toute heure, mais nous ne pouvions pas assurer une permanence 24h/24 à la réception. Nous cherchions une solution pour automatiser le check-in. Webbing a développé SelfKey, un système simple par QR code qui permet à nos clients de s'enregistrer et payer en ligne à n'importe quelle heure.",
    logo: "/logo_app/logo_selfkey.png",
    url: "https://www.selfkey.ch/",
    color: "gray",
  },
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "Réservez • Campez • Profitez",
    description:
      "Marque à part entière qui redéfini entièrement la gestion des campings modernes. Née d'une collaboration étroite avec notre client, cette innovation allie technologie, simplicité et design au service du tourisme durable.",
    testimonial:
      "Nous faisions face à un double défi : le camping sauvage sur nos terrains et la nouvelle obligation légale de percevoir la taxe de séjour. Il nous fallait une solution pour réguler l'accès, automatiser la perception de cette taxe obligatoire, et offrir une expérience moderne aux campeurs. En collaboration avec Webbing, nous avons créé SelfCamp, bien plus qu'un simple outil : une marque complète qui transforme le secteur. Les visiteurs réservent et paient en ligne 24h/24, la taxe de séjour est automatiquement collectée selon la réglementation.",
    logo: "/logo_app/logo_selfcamp.png",
    url: "https://www.selfcamp.ch/",
    color: "green",
  },
];

export default function ApplicationsPage() {
  const scrollContainerDesktopRef = useRef<HTMLDivElement>(null);
  const scrollContainerMobileRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerDesktopRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    if (direction === "right") {
      // Si on est à la fin, revenir au début
      if (currentScroll >= maxScroll - 10) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        });
      }
    } else {
      // Si on est au début, aller à la fin
      if (currentScroll <= 10) {
        container.scrollTo({
          left: maxScroll,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: -cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Image de fond avec vague blanche */}
      <WaveSeparator
        imageSrc="/background_applications.png"
        imageAlt="Applications Webbing"
        imageHeight={600}
        fillColor="#ffffff"
        className="mb-0"
      />

      {/* Hero Section moderne - Remonté avec marge négative et z-index */}
      <div className="relative z-10 -mt-12 sm:-mt-15 md:-mt-30 lg:-mt-32 xl:-mt-40">
        <Hero
          badge="Nos Applications"
          title={
            <>
              <span className="font-display">Votre vision, </span>
              <span className="text-primary font-display">notre expertise</span>
            </>
          }
          showSeparator={true}
        />
      </div>

      {/* Section Applications principales - Carousel */}
      <Section id="applications" className="pt-1 md:pt-12">
        <Container className="relative">
          {/* Titre centré */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              Découvrez nos réalisations
            </h2>
          </div>

          {/* Desktop: Carousel avec flèches */}
          <div className="hidden md:block relative">
            {/* Flèche gauche */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Carousel Desktop */}
            <div className="relative">
              <div
                ref={scrollContainerDesktopRef}
                className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide scroll-smooth gap-8 py-8"
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const cardWidth = container.offsetWidth;
                  const scrollIndex = Math.round(
                    container.scrollLeft / cardWidth
                  );
                  const index = scrollIndex % applications.length;
                  setCurrentIndex(index);
                }}
              >
                {applications.map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="snap-center flex-shrink-0 w-full"
                  >
                    <div className="w-full max-w-4xl mx-auto bg-card rounded-2xl p-8 shadow-sm border">
                      <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline">{app.category}</Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={app.logo}
                            alt={app.name}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                        <div className="group cursor-pointer">
                          <h2 className="text-4xl font-bold text-foreground">
                            {app.name}
                          </h2>
                          <div className="h-1 bg-foreground w-12 group-hover:w-[100%] transition-all duration-300 ease-out mt-1"></div>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide">
                        {app.tagline}
                      </p>

                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Témoignage du client */}
                      <div className="bg-muted/30 rounded-xl p-6 mb-8 border-l-4 border-primary/20">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          &ldquo;{app.testimonial}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          variant="outline"
                          className={`flex-1 ${
                            app.color === "orange"
                              ? "border-[#D66135]/20 text-[#D66135] hover:bg-[#D66135]/10 hover:text-[#D66135] hover:border-[#D66135]/40"
                              : app.color === "blue"
                                ? "border-blue-100 text-blue-600/70 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200"
                                : app.color === "gray"
                                  ? "border-gray-200 text-gray-600/70 hover:bg-gray-50/50 hover:text-gray-600 hover:border-gray-300"
                                  : app.color === "green"
                                    ? "border-[#a8b785]/20 text-[#a8b785] hover:bg-[#a8b785]/10 hover:text-[#a8b785] hover:border-[#a8b785]/40"
                                    : "border-primary/10 text-primary/70 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          }`}
                          asChild
                        >
                          <Link
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Découvrir {app.name}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Flèche droite */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Indicateurs de pagination pour desktop */}
            <div className="flex justify-center gap-2 mt-6">
              {applications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollContainerDesktopRef.current;
                    if (container) {
                      const cardWidth = container.offsetWidth;
                      container.scrollTo({
                        left: cardWidth * index,
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

          {/* Mobile: Carousel avec snap scrolling (même style que page d'accueil) */}
          <div className="md:hidden relative">
            <div
              ref={scrollContainerMobileRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-2 px-4 -mx-4"
              onScroll={(e) => {
                const container = e.currentTarget;
                const cardWidth = container.clientWidth * 0.85 + 8;
                const scrollIndex = Math.round(
                  container.scrollLeft / cardWidth
                );
                const index = scrollIndex % applications.length;
                setCurrentIndex(index);
              }}
            >
              {/* Beaucoup de répétitions pour un scroll vraiment long */}
              {Array.from({ length: 20 }).flatMap((_, repeatIndex) =>
                applications.map((app, index) => (
                  <div
                    key={`${app.name}-${repeatIndex}-${index}`}
                    className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]"
                  >
                    <div className="bg-card rounded-2xl p-6 shadow-sm border h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {app.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={app.logo}
                            alt={app.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {app.name}
                        </h3>
                      </div>

                      <p className="text-xs font-medium text-muted-foreground mb-3 tracking-wide">
                        {app.tagline}
                      </p>

                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                        {app.description}
                      </p>

                      {/* Témoignage compact */}
                      <div className="bg-muted/30 rounded-lg p-3 mb-4 border-l-2 border-primary/20">
                        <p
                          className={`text-xs text-muted-foreground italic leading-relaxed ${
                            expandedCards.has(
                              `${app.name}-${repeatIndex}-${index}`
                            )
                              ? ""
                              : "line-clamp-4"
                          }`}
                        >
                          &ldquo;{app.testimonial}&rdquo;
                        </p>
                        {app.testimonial.length > 200 && (
                          <button
                            onClick={() => {
                              const cardId = `${app.name}-${repeatIndex}-${index}`;
                              setExpandedCards((prev) => {
                                const newSet = new Set(prev);
                                if (newSet.has(cardId)) {
                                  newSet.delete(cardId);
                                } else {
                                  newSet.add(cardId);
                                }
                                return newSet;
                              });
                            }}
                            className="text-xs text-primary hover:underline mt-1 font-medium"
                          >
                            {expandedCards.has(
                              `${app.name}-${repeatIndex}-${index}`
                            )
                              ? "Lire moins"
                              : "Lire plus"}
                          </button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className={`w-full ${
                          app.color === "orange"
                            ? "border-[#D66135]/20 text-[#D66135] hover:bg-[#D66135]/10 hover:text-[#D66135] hover:border-[#D66135]/40"
                            : app.color === "blue"
                              ? "border-blue-100 text-blue-600/70 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200"
                              : app.color === "gray"
                                ? "border-gray-200 text-gray-600/70 hover:bg-gray-50/50 hover:text-gray-600 hover:border-gray-300"
                                : app.color === "green"
                                  ? "border-[#a8b785]/20 text-[#a8b785] hover:bg-[#a8b785]/10 hover:text-[#a8b785] hover:border-[#a8b785]/40"
                                  : "border-primary/10 text-primary/70 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                        asChild
                      >
                        <Link
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Découvrir
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Indicateurs pastilles (même style que page d'accueil) */}
            <div className="flex justify-center gap-2 mt-6">
              {applications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollContainerMobileRef.current;
                    if (container) {
                      const cardWidth = container.clientWidth * 0.85 + 8;
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

      {/* Section Citation inspirante */}
      <Section variant="muted">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <blockquote className="space-y-4">
              <p className="text-2xl md:text-4xl font-bold text-foreground italic">
                &ldquo;La meilleure façon de prédire l&apos;avenir,
                <br />
                c&apos;est de le créer.&rdquo;
              </p>
              <footer className="text-base md:text-lg text-muted-foreground">
                — Peter Drucker
              </footer>
            </blockquote>
            <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre idée mérite d&apos;exister. Nous sommes là pour la
              transformer en réalité.
            </p>
          </motion.div>
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
