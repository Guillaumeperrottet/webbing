// app/page.tsx
"use client";

import { FloatingGeometry } from "@/components/ui/floating-geometry";
import {
  FadeInWhenVisible,
  StaggerContainer,
} from "@/components/ui/motion-components";
import { StatsSection } from "@/components/ui/stats-section";
import { InteractiveBackground } from "@/components/ui/interactive-background";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  BarChart3,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0">
          <FloatingGeometry />
        </div>

        {/* Gradient overlay moderne */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />

        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge avec effet glassmorphism */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                variant="outline"
              >
                Solutions SaaS Suisses
              </Badge>
            </motion.div>

            {/* Titre principal avec effet glassmorphism */}
            <motion.div
              className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-tight mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.span
                  className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Des applications qui
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  transforment
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  votre activité
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                Solutions SaaS{" "}
                <em className="font-semibold text-primary">innovantes</em>
                conçues en Suisse
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-swiss text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-glow-primary"
                  asChild
                >
                  <Link href="/applications">
                    Découvrir nos applications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  variant="outline"
                  asChild
                >
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deux applications spécialisées pour répondre aux défis modernes
              des professionnels de l&apos;immobilier et de l&apos;analyse
              business.
            </p>
          </FadeInWhenVisible>

          <StaggerContainer staggerDelay={0.3}>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* PlanniKeeper Card */}
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Background pattern subtil */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
                  </div>

                  {/* Glow effect au hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10" />
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Logo avec animation */}
                      <motion.div
                        className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Building2 className="h-8 w-8 text-white" />
                      </motion.div>
                      <Badge
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                        variant="outline"
                      >
                        Gestion Immobilière
                      </Badge>
                    </div>

                    {/* Titre avec gradient */}
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">
                      PlanniKeeper
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      La solution complète pour gérer efficacement vos projets
                      immobiliers, vos tâches et vos documents dans une
                      interface intuitive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-sm"></div>
                        Interface interactive pour naviguer entre vos biens
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-sm"></div>
                        Système intégré de planification et suivi des tâches
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-sm"></div>
                        Collaboration d&apos;équipe en temps réel
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-sm"></div>
                        Gestion centralisée des documents
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                          asChild
                        >
                          <Link
                            href="https://www.plannikeeper.ch/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visiter le site
                          </Link>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          asChild
                        >
                          <Link href="/applications/plannikeeper">
                            En savoir plus
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Chaff Card */}
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Background pattern subtil */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
                  </div>

                  {/* Glow effect au hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10" />
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Logo avec animation */}
                      <motion.div
                        className="p-4 bg-gradient-to-br from-accent to-purple-600 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300 shadow-lg"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <BarChart3 className="h-8 w-8 text-white" />
                      </motion.div>
                      <Badge
                        className="bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20 transition-colors duration-300"
                        variant="outline"
                      >
                        Analytics Business
                      </Badge>
                    </div>

                    {/* Titre avec gradient */}
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">
                      Chaff
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      Plateforme d&apos;analyse business avancée pour
                      transformer vos données en insights stratégiques et
                      prendre des décisions éclairées.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-sm"></div>
                        Tableaux de bord interactifs personnalisables
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-sm"></div>
                        Analyse prédictive et modélisation avancée
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-sm"></div>
                        Intégration multi-sources de données
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-sm"></div>
                        Rapports automatisés et alertes intelligentes
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent/20 text-accent-foreground hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                          asChild
                        >
                          <Link
                            href="https://www.chaff.ch/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visiter le site
                          </Link>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-accent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          asChild
                        >
                          <Link href="/applications/chaff">En savoir plus</Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Section Statistiques avec animations */}
      <StatsSection />

      {/* Values Section */}
      <section className="relative py-20 px-4 bg-slate-900 overflow-hidden">
        <InteractiveBackground />
        <div className="container mx-auto max-w-6xl relative z-10">
          <FadeInWhenVisible className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pourquoi choisir Webbing ?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Notre engagement envers l&apos;excellence se reflète dans chaque
              aspect de nos solutions.
            </p>
          </FadeInWhenVisible>

          <StaggerContainer staggerDelay={0.2}>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="relative group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 text-center group-hover:border-white/20 transition-all duration-300">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Shield className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Sécurité Suisse
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Vos données sont hébergées et protégées selon les standards
                    suisses les plus stricts en matière de sécurité et de
                    confidentialité.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 text-center group-hover:border-white/20 transition-all duration-300">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Zap className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Performance Optimale
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Nos applications sont conçues pour offrir une expérience
                    fluide et réactive, même avec de gros volumes de données.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative group"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 text-center group-hover:border-white/20 transition-all duration-300">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Support Dédié
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Une équipe d&apos;experts à votre écoute pour vous
                    accompagner dans l&apos;utilisation et l&apos;optimisation
                    de nos solutions.
                  </p>
                </div>
              </motion.div>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Prêt à transformer votre activité ?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Découvrez comment nos solutions peuvent optimiser vos processus et
              accélérer votre croissance.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  asChild
                >
                  <Link href="/applications">
                    Explorer nos solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">Planifier une démo</Link>
                </Button>
              </motion.div>
            </motion.div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
}
