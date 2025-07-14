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
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// const stats = [
//   {
//     value: "150+",
//     label: "Clients satisfaits",
//     description: "Professionnels qui nous font confiance",
//   },
//   {
//     value: "99%",
//     label: "Uptime garanti",
//     description: "Disponibilité de nos services",
//   },
//   {
//     value: "24h",
//     label: "Support réactif",
//     description: "Assistance technique continue",
//   },
//   {
//     value: "5 ans",
//     label: "D'expertise",
//     description: "Dans le développement SaaS",
//   },
// ];

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

const applications = [
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "La solution complète pour gérer efficacement vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante.",
    icon: Building2,
    url: "https://www.plannikeeper.ch/",
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
    features: [
      "Tableaux de bord interactifs",
      "Analyse prédictive et modélisation avancée",
      "Intégration multi-sources de données",
      "Rapports automatisés",
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
    features: [
      "Check-in 24h/24 par QR code",
      "Paiement sécurisé avec Stripe (cartes, TWINT, Apple Pay)",
      "Accès automatique après paiement",
      "Conformité RGPD et sécurité suisse",
    ],
  },
];

export default function ModernAppsSection() {
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
                la gestion d&apos;une entreprise. Conçues en Suisse avec une
                attention particulière à la qualité et à l&apos;efficacité.
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

      {/* Valeurs - Design minimaliste (remonte ici) */}
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

      {/* Applications - Design épuré et moderne */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Nos Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trois applications spécialisées pour répondre aux défis modernes
              des professionnels.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group relative bg-white border border-slate-200 hover:border-slate-900 transition-all duration-300 hover:shadow-lg h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-900 transition-colors duration-300">
                        <app.icon className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 border-slate-200"
                      >
                        {app.category}
                      </Badge>
                    </div>

                    <CardTitle className="text-2xl text-slate-900 mb-2">
                      {app.name}
                    </CardTitle>

                    <div className="text-sm font-medium text-slate-500 mb-4 tracking-wide">
                      {app.tagline}
                    </div>

                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                      {app.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-2 mb-8 flex-1">
                      {app.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 border-slate-200 text-slate-900"
                      asChild
                    >
                      <Link
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Découvrir
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Trust By - Infinite Slider */}
      <section className="py-18 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-center text-3xl font-bold text-slate-900 mb-8">
            Trust By
          </h3>
          <div className="overflow-hidden relative">
            <motion.div
              className="flex gap-12 items-center"
              animate={{ x: [0, -400] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              style={{ willChange: "transform" }}
            >
              {[
                "/trust/logo-lac.png",
                "/trust/lodges.png",
                "/trust/alpha.png",
                "/trust/logo-pont.png",
                "/trust/popliving.png",
                "/trust/logo-sapins.png",
                "/trust/dipiaza.png",
              ].map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt={`Logo ${idx + 1}`}
                  width={200}
                  height={90}
                  className="h-20 w-auto object-contain transition duration-300"
                />
              ))}
              {[
                "/trust/logo-lac.png",
                "/trust/lodges.png",
                "/trust/alpha.png",
                "/trust/logo-pont.png",
                "/trust/popliving.png",
                "/trust/logo-sapins.png",
                "/trust/dipiaza.png",
              ].map((src, idx) => (
                <Image
                  key={"dup-" + idx}
                  src={src}
                  alt={`Logo ${idx + 1}`}
                  width={200}
                  height={90}
                  className="h-20 w-auto object-contain transition duration-300"
                />
              ))}
            </motion.div>
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
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
