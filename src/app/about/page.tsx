// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaveSeparator } from "@/components/ui/wave-separator";
import { BarChart3, Target, Globe, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Image de fond avec vague blanche */}
      <WaveSeparator
        imageSrc="/background_about.jpg"
        imageAlt="À propos de Webbing"
        imageHeight={700}
        fillColor="#ffffff"
        className="mb-0"
      />

      {/* Hero Section - Remonté avec marge négative et z-index */}
      <div className="relative z-10 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 xl:-mt-40">
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm bg-muted/50 border-border"
              >
                À propos de Webbing
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight font-display">
                Toujours en mouvement
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body">
                Nous créons des applications logiciels accessibles directement
                en ligne pensées pour les entreprises. Mais pas que...
              </p>

              {/* Trait de séparation */}
              <div className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full"></div>

              {/* Citation Guillaume - Version simplifiée */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 rounded-2xl border bg-card/50">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                    <Image
                      src="/guillaume-perrottet.jpg"
                      alt="Guillaume Perrottet"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-base font-bold text-foreground mb-2 font-display">
                      Guillaume Perrottet
                    </h3>
                    <p className="text-muted-foreground italic text-sm leading-relaxed font-body">
                      &quot;Né d&apos;un constat simple : internet évolue vite,
                      trop vite pour les solutions figées. Webbing développe des
                      applications et sites internet modernes qui grandissent
                      avec votre entreprise et suivent le rythme de
                      l&apos;innovation.&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Nos valeurs */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-display">
              Nos valeurs
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Les principes qui guident chaque projet
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Sur mesure",
                description:
                  "Chaque projet est unique. Nous créons des solutions adaptées à vos besoins spécifiques",
                icon: Target,
              },
              {
                title: "Proximité",
                description:
                  "Toujours disponible et à l'écoute. Une communication directe et transparente tout au long du projet",
                icon: Shield,
              },
              {
                title: "Innovation",
                description:
                  "Technologies modernes et approches créatives pour des solutions qui se démarquent",
                icon: BarChart3,
              },
              {
                title: "Accompagnement",
                description:
                  "De l'idée au lancement et au-delà. Nous sommes à vos côtés à chaque étape du projet",
                icon: Globe,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="group p-8 bg-card rounded-2xl border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Technologies modernes
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Stack Technique",
                description:
                  "Next.js 15, React 19, TypeScript, TailwindCSS, PostgreSQL, Prisma ORM",
                icon: BarChart3,
              },
              {
                title: "Sécurité & Performance",
                description:
                  "Chiffrement, HTTPS, authentification sécurisée, cache intelligent, optimisation des assets",
                icon: Shield,
              },
              {
                title: "Infrastructure",
                description:
                  "Hébergement Vercel, architecture serverless, auto-scaling, backups automatiques",
                icon: Globe,
              },
            ].map((tech, index) => (
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
                    <tech.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300 font-display">
                    {tech.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm font-body">
                    {tech.description}
                  </p>

                  {/* Bordure décorative au hover */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
