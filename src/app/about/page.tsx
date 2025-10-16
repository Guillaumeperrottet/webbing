// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Globe, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-32 px-4 bg-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm bg-muted/50 border-border"
            >
              À propos de Webbing
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Des solutions qui{" "}
              <span className="text-primary">simplifient</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Webbing crée des applications SaaS pensées pour les entreprises
              suisses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Notre approche
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
              Nous créons des solutions sur mesure pour transformer vos idées en
              applications concrètes. De la simple application web à la création
              complète de marques digitales, nous accompagnons nos clients dans
              toutes les étapes de leur projet.
            </p>

            <div className="bg-card rounded-2xl p-8 md:p-10 border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-28 h-28 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10 ring-offset-4 ring-offset-card">
                  <Image
                    src="/guillaume-perrottet.jpg"
                    alt="Guillaume Perrottet"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Guillaume Perrottet
                  </h3>
                  <p className="text-muted-foreground italic text-lg leading-relaxed">
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
      <section className="py-24 px-4 bg-muted/30">
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
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Stack Technique */}
            <div className="group bg-card rounded-2xl p-8 border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-5 text-lg">
                Stack Technique
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Frontend
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Next.js 15, React 19, TypeScript, TailwindCSS
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Backend
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PostgreSQL, Prisma ORM, Better-Auth
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Intégrations
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Stripe, Cloudinary, Resend
                  </p>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="group bg-card rounded-2xl p-8 border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-5 text-lg">
                Sécurité
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Protection
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Chiffrement, HTTPS, authentification sécurisée
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Performance
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cache intelligent, optimisation assets, PWA
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Conformité
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    RGPD, permissions granulaires
                  </p>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="group bg-card rounded-2xl p-8 border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-5 text-lg">
                Infrastructure
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Hébergement
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vercel, architecture serverless
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Base de données
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PostgreSQL optimisée, backups automatiques
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Évolutivité
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Auto-scaling, architecture modulaire
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
