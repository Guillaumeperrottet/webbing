"use client";

import {
  Hero,
  Section,
  Container,
  FeatureCard,
} from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import {
  Building2,
  BarChart3,
  Shield,
  RefreshCw,
  Globe,
  ArrowRight,
  Tent,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

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
    icon: Building2,
    url: "https://www.plannikeeper.ch/",
    color: "orange", // Couleur orange comme sur le site PlanniKeeper
    features: [
      "Visualisation interactive",
      "Système intégré de planification des tâches",
      "Mode collaboratif en temps réel",
      "Centralisation documentaire complète",
    ],
  },
  {
    name: "Chaff",
    category: "Analytics Business",
    tagline: "Analysez • Modélisez • Décidez",
    description:
      "Plateforme d'analyse business pour transformer vos données en insights stratégiques et prendre des décisions éclairées.",
    icon: BarChart3,
    url: "https://www.chaff.ch/",
    color: "blue", // Couleur bleue pour l'analytics
    features: [
      "Tableaux de bord interactifs",
      "Analyse prédictive et modélisation avancée",
      "Masse salariale",
      "Possibilité d'import heures de timbreuse de gastrotime",
    ],
  },
  {
    name: "SelfKey",
    category: "Check-in automatique",
    tagline: "Enregistrez • Payez • Accédez",
    description:
      "Solution suisse de check-in automatique 24h/24 : vos clients s'enregistrent, paient et accèdent à leur hébergement sans intervention.",
    icon: Shield,
    url: "https://www.selfkey.ch/",
    color: "gray", // Couleur gris clair pour SelfKey
    features: [
      "Check-in 24h/24 par QR code",
      "Paiement sécurisé avec Stripe (cartes, TWINT, Apple Pay)",
      "Accès automatique après paiement",
      "Conformité RGPD et sécurité suisse",
    ],
  },
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "Réservez • Campez • Profitez",
    description:
      "Automatisez vos check-ins 24h/24 pour votre camping. Vos clients scannent un QR code, paient en ligne et reçoivent instantanément leur accès. Parfait pour hôtels, campings, parkings et locations saisonnières.",
    icon: Tent,
    url: "https://www.selfcamp.ch/",
    color: "green", // Couleur verte pour camping/nature
    features: [
      "Check-in automatique 24h/24 sans réception",
      "Paiement sécurisé : cartes, TWINT, Apple Pay, Google Pay",
      "Gestion parking avec codes journaliers",
      "Aucune application, compte ou abonnement nécessaire",
    ],
  },
];

export default function HomePage() {
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
            animate={{ x: [0, -50 * 6] }} // 50% de la largeur d'un logo + gap (6 logos)
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
            whileHover={{ animationPlayState: "paused" }}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  icon={app.icon}
                  badge={app.category}
                  href={app.url}
                  external={true}
                  features={app.features}
                  color={app.color}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section élégante */}
      <Section className="bg-gradient-to-r from-muted/50 to-muted/30 pt-16">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Un projet en tête ?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Discutons en et créons ensemble votre application.
              </p>

              <Button size="lg" className="text-base px-8 shadow-lg" asChild>
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
