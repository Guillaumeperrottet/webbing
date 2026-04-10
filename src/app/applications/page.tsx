"use client";

import { Section, Container } from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { WaveSeparator } from "@/components/ui/wave-separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Application {
  name: string;
  category: string;
  tagline: string;
  description: string;
  logo: string;
  image: string;
  url: string;
  colorHex: string;
  partnerUrl?: string;
}

const applications: Application[] = [
  {
    name: "Wisp",
    category: "Transfert & Stockage",
    tagline: "Cloud suisse",
    description:
      "Solution suisse de stockage et de partage de fichiers. Bibliothèque d'images, transfert rapide jusqu'à 2GB, et édition de documents via Collabora — une alternative concrète à Google Drive et Microsoft 365, hébergée en Suisse.",
    logo: "/logo_app/logo_wisp.png",
    image: "/wisp_application.png",
    url: "https://wisp.ch/",
    colorHex: "#996BCF",
  },
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "La liberté de camper sans contrainte",
    description:
      "Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers. En collaboration avec l'Union fribourgeoise du Tourisme.",
    logo: "/logo_app/logo_selfcamp.png",
    image: "/selfcamp_accueil.png",
    url: "https://www.selfcamp.ch/",
    colorHex: "#3A4D2A",
    partnerUrl: "https://fribourg.ch/fr/uft-ftv/",
  },
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "Gestion efficace de vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante. Planifiez les travaux, suivez les interventions et centralisez toute la gestion depuis une seule plateforme.",
    logo: "/logo_app/logo_plannikeeper.png",
    image: "/plannikeeper_application.png",
    url: "https://www.plannikeeper.ch/",
    colorHex: "#7c2d0a",
  },
  {
    name: "OpenWind",
    category: "Sports de vent",
    tagline: "Trouvez votre spot, capturez le vent",
    description:
      "Plateforme communautaire et open-source dédiée aux passionnés de kitesurf, wing ou parapente. Découvrez les meilleurs spots, consultez les prévisions de vent en temps réel et planifiez vos sessions en cherchant le vent grâce au module de planification.",
    logo: "/logo_app/logo_openwind.png",
    image: "/openwind_application.png",
    url: "https://www.openwind.ch/",
    colorHex: "#0284c7",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen">
      {/* Image de fond avec titre en overlay */}
      <div className="relative">
        <WaveSeparator
          imageSrc="/background_applications.png"
          imageAlt="Applications Webbing"
          imageHeight={600}
          fillColor="#ffffff"
          className="mb-0"
        />
        <div className="absolute inset-0 flex items-start justify-center pt-24 sm:pt-28 md:pt-36 lg:pt-44">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white font-display text-center drop-shadow-lg px-4">
            Vos Applications
          </h1>
        </div>
      </div>

      {/* Phrase introductive */}
      <p className="relative z-10 -mt-10 mb-8 text-center text-base text-muted-foreground sm:-mt-16 md:-mt-20 lg:-mt-28 md:mb-12 md:text-lg">
        Toutes nos applications sont accessibles en ligne et hébergées en Suisse
      </p>

      {/* Section Applications */}
      <Section id="applications" className="pt-8 md:pt-16 pb-16">
        <Container
          size="xl"
          className="relative md:max-w-[98vw] lg:max-w-[96vw] xl:max-w-[94vw]"
        >
          {/* Grille 2 colonnes sur desktop avec espacement central */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-40 md:gap-y-20 lg:gap-x-48 xl:gap-x-64">
            {applications.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: (index % 2) * 0.1 }}
                viewport={{ once: true, margin: "-60px" }}
                className={`relative ${
                  index % 2 === 0
                    ? "md:-ml-12 lg:-ml-16 xl:-ml-20"
                    : "md:-mr-12 lg:-mr-16 xl:-mr-20 md:mt-24"
                }`}
              >
                {/* Image avec encadré minimaliste */}
                <div className="relative mb-8">
                  <div className="relative aspect-[4/3.3] overflow-hidden shadow-lg md:aspect-4/3">
                    <Image
                      src={app.image}
                      alt={app.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Encadré minimaliste impactant qui sort de l'image */}
                  <div
                    className={`absolute z-10 flex min-h-[140px] min-w-[200px] max-w-[280px] items-center justify-center rounded-2xl bg-white px-8 py-8 shadow-xl md:min-h-40 md:min-w-60 ${
                      index % 2 === 0
                        ? "bottom-0 -right-8 -translate-y-[10%] md:-right-12"
                        : "top-0 -left-8 translate-y-[8%] md:-left-12"
                    }`}
                  >
                    <h3
                      style={{ color: app.colorHex }}
                      className="text-center text-lg font-bold leading-tight font-display sm:text-xl"
                    >
                      {app.tagline}
                    </h3>
                  </div>
                </div>

                {/* Description et CTA sous l'image */}
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {app.partnerUrl
                      ? app.description
                          .split("l'Union fribourgeoise du Tourisme")
                          .map((part, i, arr) =>
                            i < arr.length - 1 ? (
                              <span key={i}>
                                {part}
                                <Link
                                  href={app.partnerUrl!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                                >
                                  l&apos;Union fribourgeoise du Tourisme
                                </Link>
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            ),
                          )
                      : app.description}
                  </p>
                  <Link
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    En savoir plus
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Une application en tête ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Discutons-en et créons la ensemble.
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
