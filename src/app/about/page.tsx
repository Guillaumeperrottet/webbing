// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  Users,
  Target,
  Award,
  Globe,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Version sobre */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm bg-slate-50 border-slate-200 text-slate-700"
            >
              Notre histoire
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Nous créons des solutions qui{" "}
              <span className="text-primary">transforment</span> les entreprises
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Basée en Suisse, Webbing développe des applications SaaS
              innovantes qui simplifient les processus complexes et optimisent
              la performance des entreprises modernes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Version sobre */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm bg-white border-slate-200 text-slate-700"
              >
                Notre mission
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Simplifier le complexe, optimiser l&apos;essentiel
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Nous croyons que la technologie doit servir l&apos;humain, pas
                l&apos;inverse. C&apos;est pourquoi nous développons des
                solutions intuitives qui s&apos;adaptent à vos besoins, et non
                l&apos;inverse.
              </p>
              <p className="text-slate-600 mb-8">
                Notre approche combine l&apos;excellence technique suisse avec
                une compréhension profonde des défis business modernes. Chaque
                ligne de code que nous écrivons a pour objectif d&apos;améliorer
                concrètement votre quotidien professionnel.
              </p>
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/contact">
                  Découvrir nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Target className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">150+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Clients satisfaits</p>
                </CardContent>
              </Card>
              <Card className="text-center border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Award className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    5 ans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">D&apos;expertise</p>
                </CardContent>
              </Card>
              <Card className="text-center border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Globe className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">99%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Uptime garanti</p>
                </CardContent>
              </Card>
              <Card className="text-center border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Shield className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">100%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Sécurité suisse</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos solutions en détail */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Nos solutions en détail
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Deux applications complémentaires nées de notre expertise et de
              notre compréhension des besoins du marché suisse.
            </p>
          </div>

          <div className="space-y-20">
            {/* PlanniKeeper Section */}
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    Gestion Immobilière
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  PlanniKeeper
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Née de la frustration face à la complexité des outils de
                  gestion immobilière existants, PlanniKeeper révolutionne la
                  façon dont les professionnels gèrent leurs biens. Interface
                  intuitive, collaboration fluide et organisation parfaite des
                  documents.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Interface cartographique interactive pour visualiser le portefeuille",
                    "Système de tâches intégré avec notifications intelligentes",
                    "Collaboration d'équipe en temps réel avec gestion des permissions",
                    "Centralisation et organisation automatique des documents",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://www.plannikeeper.ch/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visiter le site
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/applications/plannikeeper">
                      En savoir plus
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-primary/5 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm">
                  <Building2 className="h-12 w-12 text-slate-700" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Impact client
                </h4>
                <p className="text-slate-600 text-sm">
                  &quot;PlanniKeeper a transformé notre gestion quotidienne.
                  Nous avons gagné 40% de temps sur nos tâches
                  administratives.&quot;
                </p>
              </div>
            </motion.div>

            {/* Chaff Section */}
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 text-center lg:order-first">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm">
                  <BarChart3 className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Performance
                </h4>
                <p className="text-slate-600 text-sm">
                  &quot;Chaff nous donne une vision claire de notre performance.
                  Les insights prédictifs nous aident à anticiper les
                  tendances.&quot;
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    Analytics Business
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Chaff
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Dans un monde où les données sont partout mais les insights
                  rares, Chaff transforme vos données brutes en intelligence
                  stratégique. Tableaux de bord dynamiques, analyses prédictives
                  et alertes proactives.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Tableaux de bord personnalisables avec mise à jour en temps réel",
                    "Analyses prédictives basées sur l'intelligence artificielle",
                    "Intégration native avec vos sources de données existantes",
                    "Alertes automatisées et notifications intelligentes",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href="https://www.chaff.ch/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visiter le site
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/applications/chaff">En savoir plus</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Nos engagements
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Au-delà de la technologie, nous nous engageons sur des valeurs qui
              guident chacune de nos décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Transparence",
                description:
                  "Tarification claire, roadmap ouverte, et communication honnête sur les capacités et limitations de nos solutions.",
              },
              {
                icon: Shield,
                title: "Sécurité",
                description:
                  "Conformité RGPD, chiffrement end-to-end, et hébergement en Suisse pour protéger vos données les plus sensibles.",
              },
              {
                icon: Users,
                title: "Accompagnement",
                description:
                  "Formation complète, support réactif, et conseils stratégiques pour maximiser la valeur de nos solutions.",
              },
              {
                icon: Target,
                title: "Innovation",
                description:
                  "Veille technologique constante et amélioration continue pour rester à la pointe de l'innovation.",
              },
            ].map((engagement, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm">
                  <engagement.icon className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {engagement.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {engagement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à découvrir nos solutions ?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Parlons de votre projet et voyons comment nos solutions peuvent
              transformer votre activité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8"
                asChild
              >
                <Link href="/applications">
                  Découvrir nos applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 text-base px-8"
                asChild
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
