// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Target, Globe, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Des solutions qui{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                simplifient
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Webbing crée des applications SaaS pensées pour les entreprises
              suisses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-foreground mb-8">
              Notre approche
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
              Nous créons des solutions sur mesure pour transformer vos idées en
              applications concrètes. De la simple application web à la création
              complète de marques digitales, nous accompagnons nos clients dans
              toutes les étapes de leur projet.
            </p>

            <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl p-8 border border-border/50 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background shrink-0">
                  <Image
                    src="/guillaume-perrottet.jpg"
                    alt="Guillaume Perrottet"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Guillaume Perrottet
                  </h3>
                  <p className="text-muted-foreground italic text-lg">
                    &quot;Nous transformons vos idées en solutions digitales
                    performantes. Chaque projet est unique et mérite une
                    approche sur mesure, adaptée à vos besoins
                    spécifiques.&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-muted-foreground">
              Les principes qui guident chaque projet
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
                className="group relative p-8 bg-gradient-to-br from-background to-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-6 w-6 text-primary" />
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
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Technologies modernes
            </h2>
            <p className="text-xl text-muted-foreground">
              Performance, sécurité et évolutivité
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Stack Technique */}
            <div className="group bg-gradient-to-br from-background to-muted/30 rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-4 text-lg">
                Stack Technique
              </h3>
              <div className="space-y-3 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Frontend
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Next.js 15, React 19, TypeScript, TailwindCSS
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Backend
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL, Prisma ORM, Better-Auth
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Intégrations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Stripe, Cloudinary, Resend
                  </p>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="group bg-gradient-to-br from-background to-muted/30 rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-4 text-lg">
                Sécurité
              </h3>
              <div className="space-y-3 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Protection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Chiffrement, HTTPS, authentification sécurisée
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Performance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Cache intelligent, optimisation assets, PWA
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Conformité
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    RGPD, permissions granulaires
                  </p>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="group bg-gradient-to-br from-background to-muted/30 rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-4 text-lg">
                Infrastructure
              </h3>
              <div className="space-y-3 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Hébergement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vercel, architecture serverless
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Base de données
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL optimisée, backups automatiques
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Évolutivité
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Auto-scaling, architecture modulaire
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="container mx-auto max-w-5xl">
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
        </div>
      </section>
    </div>
  );
}
