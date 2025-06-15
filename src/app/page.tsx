// app/page.tsx
"use client";

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
  Shield,
  RefreshCw,
  CheckCircle,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  {
    value: "150+",
    label: "Clients satisfaits",
    description: "Professionnels qui nous font confiance",
  },
  {
    value: "99%",
    label: "Uptime garanti",
    description: "Disponibilité de nos services",
  },
  {
    value: "24h",
    label: "Support réactif",
    description: "Assistance technique continue",
  },
  {
    value: "5 ans",
    label: "D'expertise",
    description: "Dans le développement SaaS",
  },
];

const values = [
  {
    icon: Shield,
    title: "Sécurité Suisse",
    description:
      "Vos données sont hébergées et protégées selon les standards suisses les plus stricts en matière de sécurité et de confidentialité.",
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Version sobre */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm bg-slate-50 border-slate-200 text-slate-700"
              >
                Solutions SaaS Suisses
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Des applications qui{" "}
                <span className="text-primary">transforment</span> votre
                activité
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Nous développons des solutions SaaS innovantes pour simplifier
                la gestion immobilière et optimiser vos analyses business.
                Conçues en Suisse avec une attention particulière à la qualité
                et à l&apos;efficacité.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/applications">
                  Découvrir nos applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                asChild
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques - Version épurée */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-slate-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications - Design épuré */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Nos Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Deux applications spécialisées pour répondre aux défis modernes
              des professionnels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PlanniKeeper Card - Style PlanniKeeper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 border-b border-orange-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl shadow-sm"
                      style={{ backgroundColor: "#c6780a" }}
                    >
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 border-orange-200"
                      style={{ color: "#c6780a" }}
                    >
                      Gestion Immobilière
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <CardTitle className="text-2xl text-slate-900 mb-2">
                      PlanniKeeper
                    </CardTitle>
                    <div
                      className="font-semibold text-sm tracking-wide"
                      style={{ color: "#c6780a" }}
                    >
                      Organisez • Planifiez • Maîtrisez
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    Finis les fichiers Excel et les notes éparpillées ! La
                    solution complète pour gérer efficacement vos biens
                    immobiliers dans une interface intuitive et élégante.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {[
                      "Visualisation interactive de vos biens",
                      "Système intégré de planification des tâches",
                      "Mode collaboratif en temps réel",
                      "Centralisation documentaire complète",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: "#c6780a" }}
                        />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-200 hover:bg-orange-50"
                      style={{ color: "#c6780a" }}
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chaff Card - Style Chaff */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl shadow-sm"
                      style={{ backgroundColor: "#3c71ed" }}
                    >
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 border-blue-200"
                      style={{ color: "#3c71ed" }}
                    >
                      Analytics Business
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <CardTitle className="text-2xl text-slate-900 mb-2">
                      Chaff
                    </CardTitle>
                    <div
                      className="font-semibold text-sm tracking-wide"
                      style={{ color: "#3c71ed" }}
                    >
                      Analysez • Modélisez • Décidez
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    Plateforme d&apos;analyse business avancée pour transformer
                    vos données en insights stratégiques et prendre des
                    décisions éclairées dans une interface moderne et intuitive.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {[
                      "Tableaux de bord interactifs",
                      "Analyse prédictive et modélisation avancée",
                      "Intégration multi-sources de données",
                      "Rapports automatisés",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: "#3c71ed" }}
                        />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 hover:bg-blue-50"
                      style={{ color: "#3c71ed" }}
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valeurs - Design minimaliste */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir Webbing ?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Notre engagement envers l&apos;excellence se reflète dans chaque
              aspect de nos solutions.
            </p>
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm">
                  <value.icon className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Version sobre */}
      <section className="py-24 px-4 bg-slate-900">
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
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Découvrez comment nos solutions peuvent optimiser vos processus et
              accélérer votre croissance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8"
                asChild
              >
                <Link href="/applications">
                  Explorer nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 text-base px-8"
                asChild
              >
                <Link href="/contact">Planifier une démo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
