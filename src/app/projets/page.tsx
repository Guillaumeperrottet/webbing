"use client";

import { Hero, Section, Container } from "@/components/ui/webbing-ui";
import { Badge } from "@/components/ui/badge";
import { WaveSeparator } from "@/components/ui/wave-separator";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useRef, useEffect, useState } from "react";

const projects = [
  {
    name: "Selfcamp",
    category: "Camping automatisé",
    year: "2025",
    description:
      "Plateforme de réservation d'aires de camping automatisées. Paiement en ligne et carte interactive des emplacements en temps réel.",
    image: "/projects/selfcamp.png",
    url: "https://www.selfcamp.ch/",
    tags: ["Map interactive", "Paiements en ligne", "Temps réel"],
    color: "#849A4F",
  },
  {
    name: "Alpha Hotel",
    category: "Hôtel",
    year: "2025",
    description:
      "Site web pour l'Alpha Hotel à Fribourg. Design élégant avec système de réservation intégré et présentation des services de l'établissement.",
    image: "/projects/alpha-hotel.png",
    url: "#",
    tags: ["Moderne", "Réservation", "En développement"],
    color: "#6E8C50",
    inProgress: true,
  },
  {
    name: "PopLiving",
    category: "Habitat flexible",
    year: "2024",
    description:
      "Site multilingue pour PopLiving, solution d'habitat flexible. Interface simple, présentation des chambres et services et prise de contact.",
    image: "/projects/popliving.png",
    url: "https://www.popliving.ch/fr",
    tags: ["Interactif", "Multilingue", "Formulaire"],
    color: "#FF6900",
  },
  {
    name: "Dipiaza",
    category: "Bar à café",
    year: "2024",
    description:
      "Site vitrine moderne pour Dipiaza, bar à café à Bulle. Design élégant et responsive mettant en valeur les produits et l'atmosphère du restaurant.",
    image: "/projects/dipiaza.png",
    url: "https://www.dipiaza.ch/",
    tags: ["Simplicité", "Design Modern", "Coffee"],
    color: "#FD2B12",
  },
];

export default function ProjetsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth * 0.85 + 8;
      const scrollIndex = Math.round(scrollLeft / cardWidth);
      const index = scrollIndex % projects.length;
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Image de fond avec vague blanche */}
      <WaveSeparator
        imageSrc="/background-projet.jpg"
        imageAlt="Projets Web Webbing"
        imageHeight={600}
        fillColor="#ffffff"
        className="mb-0"
      />

      {/* Hero Section - Remonté avec marge négative et z-index */}
      <div className="relative z-10 -mt-12 sm:-mt-15 md:-mt-30 lg:-mt-32 xl:-mt-40">
        <Hero
          badge="Nos Réalisations"
          title={
            <>
              <span className="font-display">Sites web </span>
              <span className="text-primary font-display">sur mesure</span>
            </>
          }
          description="Découvrez nos projets de sites internet réalisés pour nos clients."
          showSeparator={true}
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24"
        />
      </div>

      {/* Section Projets */}
      <Section className="pt-1 md:pt-12">
        <Container>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Image du projet */}
                  <div className="relative h-64 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge année */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {project.inProgress && (
                        <Badge className="bg-orange-500/90 text-white backdrop-blur border-0">
                          En développement
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="bg-background/95 backdrop-blur"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {project.year}
                      </Badge>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: project.color,
                          color: project.color,
                        }}
                      >
                        {project.category}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors font-display">
                      {project.name}
                    </h3>

                    <p className="text-muted-foreground mb-4 leading-relaxed font-body">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Lien */}
                    {project.inProgress ? (
                      <div className="inline-flex items-center font-medium text-muted-foreground cursor-not-allowed">
                        Bientôt disponible
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </div>
                    ) : (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          track("Project Click", {
                            project: project.name,
                            category: project.category,
                          })
                        }
                        className="inline-flex items-center font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Voir le site
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-2 px-4 -mx-4"
            >
              {Array.from({ length: 20 }).flatMap((_, repeatIndex) =>
                projects.map((project, index) => (
                  <div
                    key={`${project.name}-${repeatIndex}-${index}`}
                    className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]"
                  >
                    <div className="bg-card rounded-2xl border overflow-hidden h-full">
                      {/* Image du projet */}
                      <div className="relative h-48 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-contain"
                        />

                        {/* Badge année */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                          {project.inProgress && (
                            <Badge className="bg-orange-500/90 text-white backdrop-blur border-0 text-xs">
                              En dev
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="bg-background/95 backdrop-blur text-xs"
                          >
                            <Calendar className="h-2.5 w-2.5 mr-1" />
                            {project.year}
                          </Badge>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: project.color,
                              color: project.color,
                            }}
                          >
                            {project.category}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                          {project.name}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed font-body">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Lien */}
                        {project.inProgress ? (
                          <div className="inline-flex items-center text-sm font-medium text-muted-foreground">
                            Bientôt disponible
                          </div>
                        ) : (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              track("Project Click", {
                                project: project.name,
                                category: project.category,
                              })
                            }
                            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            Voir le site
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Indicateurs pastilles */}
            <div className="flex justify-center gap-2 mt-6">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      const cardWidth = container.clientWidth * 0.85 + 8;
                      const currentScroll = container.scrollLeft;
                      const currentRepeat = Math.floor(
                        currentScroll / (cardWidth * projects.length)
                      );
                      container.scrollTo({
                        left:
                          currentRepeat * (cardWidth * projects.length) +
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
                  aria-label={`Aller à ${projects[index].name}`}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section Processus */}
      <Section>
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Notre processus
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Analyse",
                description:
                  "Comprendre vos besoins et définir ensemble les objectifs du projet.",
              },
              {
                step: "02",
                title: "Conception",
                description:
                  "Création des maquettes et validation du design avec vous.",
              },
              {
                step: "03",
                title: "Développement",
                description:
                  "Développement du site avec les technologies les plus modernes.",
              },
              {
                step: "04",
                title: "Lancement",
                description:
                  "Mise en ligne, formation et accompagnement continu.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 text-2xl font-bold text-primary">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto bg-card rounded-3xl p-12 border shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
                Un projet de site internet ?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-body">
                Discutons-en et créons ensemble votre site web.
              </p>

              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
                onClick={() =>
                  track("CTA Click", {
                    section: "projets",
                    action: "contact_button",
                  })
                }
              >
                Nous contacter
              </a>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
