"use client";

import { Section, Container } from "@/components/ui/webbing-ui";
import { WaveSeparator } from "@/components/ui/wave-separator";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useRef, useEffect, useState } from "react";

interface Project {
  name: string;
  category: string;
  year: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  color: string;
  inProgress?: boolean;
}

const projects: Project[] = [
  {
    name: "Alpha Hotel",
    category: "Hôtel",
    year: "2026",
    description:
      "Site web pour l'Alpha Hotel à Fribourg. Design élégant avec système de réservation intégré et présentation des services de l'établissement.",
    image: "/projects/alpha_project.png",
    url: "https://www.alpha-hotel.ch/",
    tags: ["Moderne", "Réservation"],
    color: "#6E8C50",
  },
  {
    name: "Coachingbymarie",
    category: "Coaching sportif",
    year: "2026",
    description:
      "Site vitrine pour coach sportive diplômée proposant du coaching privé, des cours collectifs en extérieur et en intérieur dans la région de Bulle.",
    image: "/projects/coaching_projet.png",
    url: "https://www.coachingbymarie.ch/",
    tags: ["Design Modern", "Responsive", "Galerie"],
    color: "#FF6B9D",
  },
  {
    name: "Selfcamp",
    category: "Camping automatisé",
    year: "2025",
    description:
      "Plateforme de réservation d'aires de camping automatisées. Paiement en ligne et carte interactive des emplacements en temps réel.",
    image: "/projects/selfcamp_projet.png",
    url: "https://www.selfcamp.ch/",
    tags: ["Map interactive", "Paiements en ligne", "Temps réel"],
    color: "#849A4F",
  },
  {
    name: "PopLiving",
    category: "Habitat flexible",
    year: "2024",
    description:
      "Site multilingue pour PopLiving, solution d'habitat flexible. Interface simple, présentation des chambres et services et prise de contact.",
    image: "/projects/popliving_projet.png",
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
    image: "/projects/dipiaza_projet.png",
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
      {/* Image de fond avec titre en overlay */}
      <div className="relative">
        <WaveSeparator
          imageSrc="/background-projet.jpg"
          imageAlt="Projets Web Webbing"
          imageHeight={600}
          fillColor="#ffffff"
          className="mb-0"
        />
        <div className="absolute inset-0 flex items-start justify-center pt-24 sm:pt-28 md:pt-36 lg:pt-44">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white font-display text-center drop-shadow-lg px-4">
            Vos Projets
          </h1>
        </div>
      </div>

      {/* Phrase introductive */}
      <p className="relative z-10 -mt-10 mb-8 text-center text-base text-muted-foreground sm:-mt-16 md:-mt-20 lg:-mt-28 md:mb-12 md:text-lg">
        Découvrez nos projets de sites internet réalisés pour nos clients.
      </p>

      {/* Section Projets */}
      <Section className="pt-1 md:pt-12">
        <Container
          size="xl"
          className="relative md:max-w-[98vw] lg:max-w-[96vw] xl:max-w-[94vw]"
        >
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-x-6 lg:gap-x-8 xl:gap-x-10 gap-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: (index % 2) * 0.1 }}
                viewport={{ once: true, margin: "-60px" }}
                className={`group ${index % 2 !== 0 ? "mt-24" : ""}`}
              >
                <a
                  href={project.inProgress ? undefined : project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    !project.inProgress &&
                    track("Project Click", {
                      project: project.name,
                      category: project.category,
                    })
                  }
                  className={
                    project.inProgress ? "cursor-default" : "cursor-pointer"
                  }
                >
                  {/* Image avec overlay hover */}
                  <div className="relative overflow-hidden shadow-md">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={800}
                      height={600}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay au hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-8 text-center">
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        {project.description}
                      </p>
                      {!project.inProgress && (
                        <span className="inline-flex items-center text-white text-xs font-medium gap-1 border border-white/50 rounded-full px-3 py-1">
                          Voir le site <ExternalLink className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </a>
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
                    className="snap-center shrink-0 w-[85vw] max-w-[340px]"
                  >
                    <div className="bg-card rounded-2xl border overflow-hidden h-full">
                      {/* Image du projet */}
                      <div className="relative h-48 bg-linear-to-br from-background via-muted/20 to-background overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-contain"
                        />

                        {/* Badge année */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                          {project.inProgress && (
                            <span className="inline-flex items-center rounded-full bg-orange-500/90 px-2 py-0.5 text-xs text-white backdrop-blur">
                              En dev
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full border bg-background/95 px-2 py-0.5 text-xs backdrop-blur">
                            {project.year}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                            style={{
                              borderColor: project.color,
                              color: project.color,
                            }}
                          >
                            {project.category}
                          </span>
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
                )),
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
                        currentScroll / (cardWidth * projects.length),
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
