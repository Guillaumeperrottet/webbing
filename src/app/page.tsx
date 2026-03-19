"use client";

import {
  Section,
  Container,
  ImageFeatureCard,
} from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { track } from "@vercel/analytics";

const trustLogos = [
  { src: "/trust/logo-potentille.png", alt: "Potentille" },
  { src: "/trust/lodges.png", alt: "Lodges" },
  { src: "/trust/alpha.png", alt: "Alpha" },
  { src: "/trust/popliving.png", alt: "PopLiving" },
  { src: "/trust/dipiaza.png", alt: "Dipiaza" },
  { src: "/trust/logo-campus.png", alt: "Campus Logo" },
] as const;

const applications = [
  {
    name: "Applications Web",
    category: "Votre programme",
    tagline: "Développez • Automatisez • Évoluez",
    description:
      "Pour créer votre application, adaptée à vos besoins, des intégrations personnalisées et une architecture performante. Nous nous occupons de tout, de la conception à l'hébergement en Suisse 🇨🇭.",
    logo: "/logo_app/logo_wisp.png",
    image: "/wisp_accueil.png",
    url: "/applications",
    color: "purple",
    features: [
      "Architecture scalable et performante",
      "Intégrations API personnalisées",
      "Authentification sécurisée",
      "Base de données optimisée",
      "Support et maintenance inclus",
      "Hébergement en Suisse 🇨🇭",
    ],
  },
  {
    name: "Sites Internet",
    category: "Vitrines & Portfolios",
    tagline: "Créez • Présentez • Convertissez",
    description:
      "Des sites web évolutifs et simples qui mettent en valeur votre activité et vos envies.",
    logo: "/logo_app/logo_plannikeeper.png",
    image: "/alpha_accueil.png",
    url: "/projets",
    color: "orange",
    features: [
      "Design personnalisé et moderne",
      "Optimisation SEO intégrée",
      "Mobile-first responsive",
      "Formulaires de contact",
      "Analyses et statistiques",
      "Maintenance et support continu",
    ],
  },
  {
    name: "SelfCamp",
    category: "Self check-in",
    tagline: "Réservez • Payez • Accédez",
    description:
      "Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers. En partenariat avec l'UFT.",
    logo: "/logo_app/logo_selfkey.png",
    image: "/selfcamp_accueil.png",
    url: "https://www.selfcamp.ch/",
    color: "gray",
    features: [
      "Carte interactive des emplacements",
      "Réservation 24h/24 automatisée",
      "Paiements en ligne sécurisés",
      "Synchronisation temps réel",
      "Gestion des utilisateurs",
      "Notifications automatiques",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="relative -mt-16 min-h-svh overflow-hidden md:-mt-20 md:h-[120vh]">
        <Image
          src="/lac_gruyère.jpg"
          alt="Webbing - Applications web sur mesure"
          fill
          priority
          className="object-cover scale-115 md:scale-110"
        />

        <div className="absolute inset-0 bg-black/35 md:bg-black/20" />

        <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 pb-24 pt-28 text-center md:h-full md:justify-start md:px-4 md:pt-40">
          <Image
            src="/webbing_informatique_blanc.png"
            alt="Webbing Informatique"
            width={300}
            height={100}
            className="mx-auto mb-10 h-auto w-[220px] sm:w-[260px] md:mb-16 md:mt-4 md:w-[360px] lg:w-[400px]"
            priority
          />
          <h1 className="max-w-[12ch] text-balance text-4xl font-bold text-white font-display sm:text-5xl md:max-w-4xl md:text-5xl lg:text-6xl">
            Votre fidèle créateur
          </h1>
          <p className="mb-8 mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            Solutions web accessibles, créatives et simples. Donnez à votre
            activité l&apos;impact qu&apos;elle mérite.
          </p>
          <button
            type="button"
            aria-label="Descendre vers nos services"
            className="mt-2 inline-flex items-center justify-center rounded-full p-2 text-white/90 transition-colors hover:text-white"
            onClick={() => {
              document
                .getElementById("solutions")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ChevronDown className="h-8 w-8 animate-bounce" />
          </button>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          <polygon points="0,45 1200,-5 1200,18 0,68" fill="#000000" />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          <polygon points="0,50 1200,0 1200,100 0,100" fill="white" />
        </svg>
      </div>

      <Section className="pt-2 md:pt-0" id="solutions">
        <Container>
          <div className="mb-10 text-center md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Nos Solutions
            </h2>
          </div>

          <div
            className="hidden md:grid md:grid-cols-3 gap-y-32"
            style={{ columnGap: "18rem" }}
          >
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ImageFeatureCard
                  title={app.name}
                  description={app.description}
                  image={app.image}
                  badge={app.category}
                  href={app.url}
                  contentClassName={
                    app.name === "Sites Internet"
                      ? "md:min-h-[340px]"
                      : undefined
                  }
                  bottomMediaSrc={
                    app.name === "SelfCamp" ? "/UFT.gif" : undefined
                  }
                  bottomMediaAlt={
                    app.name === "SelfCamp" ? "Partenariat UFT" : undefined
                  }
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:hidden">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ImageFeatureCard
                  title={app.name}
                  description={app.description}
                  image={app.image}
                  badge={app.category}
                  href={app.url}
                  contentClassName={
                    app.name === "Sites Internet"
                      ? "md:min-h-[340px]"
                      : undefined
                  }
                  bottomMediaSrc={
                    app.name === "SelfCamp" ? "/UFT.gif" : undefined
                  }
                  bottomMediaAlt={
                    app.name === "SelfCamp" ? "Partenariat UFT" : undefined
                  }
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="overflow-hidden">
        <Container>
          <motion.h3
            className="text-center text-2xl md:text-3xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          ></motion.h3>
        </Container>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="md:hidden overflow-hidden">
            <motion.div
              className="flex items-center gap-5 py-8"
              animate={{ x: [0, -((112 + 20) * trustLogos.length)] }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
                repeatType: "loop",
              }}
              style={{ willChange: "transform" }}
            >
              {trustLogos.concat(trustLogos).map((logo, idx) => (
                <div
                  key={`${logo.alt}-${idx}`}
                  className="flex h-16 w-28 shrink-0 items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={112}
                    height={64}
                    className="max-h-12 w-auto object-contain opacity-70"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="hidden md:block overflow-hidden">
            <motion.div
              className="flex gap-16 items-center py-12"
              animate={{ x: [0, -((180 + 64) * trustLogos.length)] }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "linear",
                repeatType: "loop",
              }}
              style={{ willChange: "transform" }}
            >
              {trustLogos.concat(trustLogos).map((logo, idx) => (
                <div
                  key={`${logo.alt}-${idx}`}
                  className="shrink-0 flex items-center justify-center w-48 h-24"
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

      <section className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8 md:rounded-3xl md:p-12">
              <h2 className="mb-4 text-3xl font-bold text-foreground font-display md:mb-6 md:text-4xl">
                Un projet en tête ?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground font-body md:text-lg">
                Discutons-en et créons ensemble vos idées.
              </p>

              <Button
                size="lg"
                className="w-full px-8 text-base sm:w-auto"
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
