"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
    name: "Pattùs Hotel",
    category: "Hôtel & restaurant",
    year: "2026",
    description:
      "Site multilingue pour Pattùs Hotel à Saint-Aubin-Sauges, au bord du lac de Neuchâtel. Univers éditorial immersif, présentation des chambres, restaurant, événements et réservation en ligne.",
    image: "/projects/pattus_projet.jpg",
    url: "https://www.pattushotel.ch/fr",
    tags: ["Multilingue", "Réservation", "Hôtellerie"],
    color: "#25395D",
  },
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
    tags: ["Design moderne", "Responsive", "Galerie"],
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
    tags: ["Simplicité", "Design moderne", "Café"],
    color: "#FD2B12",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="min-w-0">
      <div className="overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={project.image}
          alt={`Aperçu du site ${project.name}`}
          width={800}
          height={600}
          sizes="(min-width: 1440px) 640px, (min-width: 768px) 46vw, 85vw"
          className="h-auto w-full"
        />
      </div>
      <div className="pt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h2 className="project-name mb-3 min-w-0 break-words font-display font-bold text-foreground">
          {project.name}
        </h2>
        <p className="mb-4 max-w-prose text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <ul aria-label={`Caractéristiques de ${project.name}`} className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        {project.inProgress ? (
          <p className="py-3 text-base text-muted-foreground">Bientôt disponible</p>
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
            aria-label={`Voir le site ${project.name} (nouvel onglet)`}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-base font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Voir le site
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjetsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToProject = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const firstCard = container.children[0] as HTMLElement | undefined;
    const card = container.children[index] as HTMLElement | undefined;
    if (!firstCard || !card) return;
    container.scrollTo({
      left: card.offsetLeft - firstCard.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.children) as HTMLElement[];
      const firstCard = cards[0];
      if (!firstCard) return;
      const maximumScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      const offsets = cards.map((card) =>
        Math.min(card.offsetLeft - firstCard.offsetLeft, maximumScroll),
      );
      const nearestIndex = offsets.reduce(
        (nearest, offset, index) =>
          Math.abs(offset - container.scrollLeft) <
          Math.abs(offsets[nearest] - container.scrollLeft)
            ? index
            : nearest,
        0,
      );
      setCurrentIndex(nearestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(container);
    handleScroll();
    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section className="page-intro">
        <div className="site-container grid min-w-0 items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <h1 className="page-title">Vos projets</h1>
            <p className="page-lead">
              Découvrez nos projets de sites internet réalisés pour nos clients.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/background-projet.jpg"
              alt="Projets Web Webbing"
              width={1000}
              height={600}
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[2/1] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="pattus-hotel" className="site-section pt-0" aria-label="Nos réalisations">
        <div className="site-container">
          <div className="hidden grid-cols-[repeat(2,minmax(0,1fr))] gap-x-8 gap-y-14 md:grid lg:gap-x-12 lg:gap-y-20">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>

          <div className="md:hidden">
            <div
              ref={scrollContainerRef}
              tabIndex={0}
              role="region"
              aria-label="Réalisations. Utilisez les flèches du clavier pour parcourir les projets."
              aria-roledescription="carrousel"
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                let nextIndex: number;
                if (event.key === "ArrowRight") nextIndex = Math.min(currentIndex + 1, projects.length - 1);
                else if (event.key === "ArrowLeft") nextIndex = Math.max(currentIndex - 1, 0);
                else if (event.key === "Home") nextIndex = 0;
                else if (event.key === "End") nextIndex = projects.length - 1;
                else return;
                event.preventDefault();
                scrollToProject(nextIndex);
              }}
              className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto rounded-sm pb-3 scrollbar-hide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {projects.map((project, index) => (
                <div
                  key={project.name}
                  role="group"
                  aria-roledescription="diapositive"
                  aria-label={`${index + 1} sur ${projects.length}`}
                  className="min-w-0 w-[88%] shrink-0 snap-start"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-1" aria-label="Choisir une réalisation">
              {projects.map((project, index) => (
                <button
                  key={project.name}
                  type="button"
                  onClick={() => scrollToProject(index)}
                  aria-label={`Aller à ${project.name}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 rounded-full ${currentIndex === index ? "w-6 bg-foreground" : "w-2 bg-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-border bg-secondary">
        <div className="site-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="section-heading">Un projet de site internet ?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Discutons-en et créons ensemble votre site web.
            </p>
          </div>
          <Button asChild size="lg" className="min-h-11">
            <a
              href="/contact"
              onClick={() =>
                track("CTA Click", {
                  section: "projets",
                  action: "contact_button",
                })
              }
            >
              Nous contacter
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
