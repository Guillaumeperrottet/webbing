// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  Target,
  Globe,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Version sobre */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
                L&apos;histoire derrière le projet
              </Badge>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Comment une passion pour la{" "}
              <span className="text-primary">technologie</span> a donné
              naissance à Webbing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              L&apos;histoire de trois applications SaaS nées d&apos;un besoin
              concret et d&apos;une volonté de simplifier les processus
              complexes des entreprises suisses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi Webbing - Section story */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Pourquoi Webbing ?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Webbing est né d&apos;un constat simple : les entrepreneurs et
                professionnels suisses méritent des outils aussi efficaces que
                leur ambition. Après avoir développé PlanniKeeper pour répondre
                aux défis concrets de la gestion immobilière, puis Chaff pour
                transformer les données en intelligence business, nous avons
                réalisé que notre approche pouvait aider bien d&apos;autres
                secteurs.
              </p>
              <p className="text-muted-foreground mb-8">
                Notre philosophie est simple : la technologie doit
                s&apos;adapter à vos besoins, pas l&apos;inverse. C&apos;est
                pourquoi nous développons des solutions intuitives, robustes et
                pensées pour le marché suisse, avec une attention particulière à
                la sécurité et à la performance.
              </p>
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/applications">
                  Découvrir nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-muted to-muted/50 rounded-xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-background border border-border rounded-full mb-6 shadow-sm">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-3">
                  Un projet développé avec passion
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  &quot;Chaque ligne de code que nous écrivons a pour objectif
                  d&apos;améliorer concrètement le quotidien de nos
                  utilisateurs. C&apos;est notre moteur principal.&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Derrière Webbing - Section équipe */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Derrière Webbing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un projet développé avec passion
            </p>
          </div>

          <motion.div
            className="grid lg:grid-cols-3 gap-12 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Photo et infos de Guillaume */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 shadow-lg overflow-hidden border-4 border-primary/20">
                <Image
                  src="/guillaume-perrottet.jpg" // Remplacez par le nom de votre fichier
                  alt="Guillaume Perrottet"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Guillaume Perrottet
              </h3>
              <Badge variant="secondary" className="mb-4">
                Fondateur & Développeur
              </Badge>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                J&apos;ai créé Webbing pour répondre aux défis spécifiques que
                j&apos;ai rencontrés en développant des solutions SaaS pour
                différents secteurs. Combinant une expertise technique solide
                avec une compréhension pratique des besoins business, je
                développe et améliore continuellement ces solutions pour les
                rendre toujours plus intuitives et efficaces.
              </p>

              <div className="bg-muted/50 rounded-xl p-6 border-l-4 border-primary">
                <p className="text-muted-foreground italic leading-relaxed">
                  &quot;Je crois fermement que la technologie doit servir
                  l&apos;humain, pas l&apos;inverse. C&apos;est pourquoi nos
                  applications sont conçues pour être intuitives, adaptées à la
                  réalité du terrain, et en constante évolution selon les
                  retours des utilisateurs.&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notre parcours - Timeline */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Notre parcours
            </h2>
            <p className="text-xl text-muted-foreground">
              Webbing est un projet en constante évolution, à la pointe de la
              technologie actuelle et en amélioration continue.
            </p>
          </div>

          <div className="relative space-y-12">
            {/* Ligne de connexion */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border md:block hidden"></div>

            {[
              {
                year: "2022",
                title: "Naissance de l'idée",
                description:
                  "Face aux défis concrets de gestion dans différents secteurs, l'idée de créer des solutions SaaS spécialisées émerge.",
                icon: Target,
              },
              {
                year: "2023",
                title: "Développement de PlanniKeeper",
                description:
                  "Création de la première application dédiée à la gestion immobilière avec une approche collaborative et intuitive.",
                icon: Building2,
              },
              {
                year: "2024",
                title: "Lancement de Chaff",
                description:
                  "Extension vers l'analytics business avec une plateforme d'intelligence prédictive pour transformer les données en insights.",
                icon: BarChart3,
              },
              {
                year: "2025",
                title: "Expansion et innovation",
                description:
                  "Consolidation de l'offre Webbing avec de nouvelles fonctionnalités et une vision élargie des solutions SaaS.",
                icon: Globe,
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                className="grid md:grid-cols-4 gap-8 items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
                    <milestone.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre stack technique */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Notre stack technique
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nos applications sont bâties sur des technologies modernes et
              robustes, garantissant performance, sécurité et évolutivité.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Stack Technique */}
            <motion.div
              className="bg-muted/30 rounded-xl p-8 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Stack Technique
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Frontend
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Next.js 15 (React 19), TypeScript, TailwindCSS, Framer
                    Motion
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Backend
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    API Routes Next.js, PostgreSQL, Prisma ORM, Better-Auth
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Intégrations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Stripe, Cloudinary, Vercel, Resend
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sécurité & Performance */}
            <motion.div
              className="bg-muted/30 rounded-xl p-8 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Sécurité & Performance
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Protection des données
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Chiffrement, HTTPS, authentification sécurisée, permissions
                    granulaires
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Optimisations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Architecture moderne, mise en cache intelligente, PWA,
                    optimisation des assets
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Évolutivité */}
            <motion.div
              className="bg-muted/30 rounded-xl p-8 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Évolutivité
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Infrastructure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Serverless auto-adaptatif, base de données optimisée
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Modulaire et conçue pour faciliter l&apos;ajout de nouvelles
                    fonctionnalités
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-muted/50 rounded-xl p-8 border-l-4 border-primary max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground italic">
                &quot;La technologie est au service de l&apos;expérience
                utilisateur, pas l&apos;inverse.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-stone-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à transformer votre activité ?
            </h2>
            <p className="text-xl text-stone-200 mb-8 max-w-2xl mx-auto">
              Découvrez comment PlanniKeeper et Chaff peuvent simplifier vos
              processus et optimiser votre performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-stone-800 hover:bg-stone-50 text-base px-8"
                asChild
              >
                <Link href="/applications">
                  Découvrir nos applications
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
