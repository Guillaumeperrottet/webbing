"use client";

import { Hero, Section, Container } from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CloudBackground } from "@/components/ui/cloud-background";
import {
  ExternalLink,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Sparkles,
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

const values = [
  {
    icon: Zap,
    title: "Performance",
    description:
      "Des applications rapides et optimisées pour votre productivité quotidienne.",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description:
      "Vos données sont protégées selon les standards suisses les plus exigeants.",
  },
  {
    icon: Users,
    title: "Support",
    description:
      "Une équipe locale, disponible et réactive pour vous accompagner.",
  },
  {
    icon: Sparkles,
    title: "Simplicité",
    description:
      "Aucune installation logiciel requise. Accès web intuitif et fluide.",
  },
];

export default function ApplicationsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth;
    container.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen relative">
      {/* Nuages animés en arrière-plan */}
      <CloudBackground />

      {/* Hero Section moderne */}
      <Hero
        badge="Nos Applications"
        title={
          <>
            Applications{" "}
            <span className="text-primary">utilisées au quotidien</span>
          </>
        }
      />

      {/* Section Applications principales - Carousel */}
      <Section id="applications">
        <Container className="relative">
          {/* Titre centré */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Découvrez nos réalisations
            </h2>
          </div>

          {/* Carousel Container avec flèches sur les côtés */}
          <div className="relative">
            {/* Flèche gauche */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Carousel */}
            <div className="relative overflow-hidden h-[650px]">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-8 py-8 h-full"
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const cardWidth = container.offsetWidth;
                  const scrollIndex = Math.round(
                    container.scrollLeft / cardWidth
                  );
                  // Modulo pour mapper sur les 4 applications réelles
                  const index = scrollIndex % applications.length;
                  setCurrentIndex(index);
                }}
              >
                {Array.from({ length: 20 }).flatMap((_, repeatIndex) =>
                  applications.map((app, index) => (
                    <motion.div
                      key={`${app.name}-${repeatIndex}`}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="snap-center flex-shrink-0 w-full"
                    >
                      <div className="w-full max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                          <Badge variant="outline">{app.category}</Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative w-16 h-16 flex items-center justify-center">
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
                  ))
                )}
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
          </div>

          {/* Indicateurs de navigation (pastilles) - en dessous */}
          <div className="flex justify-center gap-2 mt-4">
            {applications.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 h-2 bg-foreground rounded-full"
                    : "w-2 h-2 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50"
                }`}
                aria-label={`Aller à ${applications[index].name}`}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Section Valeurs */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir nos solutions ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous mettons la technologie au service de votre réussite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <value.icon className="h-8 w-8 text-primary" />
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
