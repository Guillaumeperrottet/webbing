"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ApplicationsPage() {
  const features = {
    plannikeeper: [
      "Interface cartographique interactive",
      "Gestion centralisée des documents",
      "Collaboration d'équipe en temps réel",
      "Système de tâches intégré",
      "Notifications intelligentes",
      "Rapports automatisés",
      "Mobile-first responsive design",
      "Intégrations tierces",
    ],
    chaff: [
      "Tableaux de bord personnalisables",
      "Analyses prédictives IA",
      "Alertes proactives",
      "Intégration multi-sources",
      "Visualisations avancées",
      "Exports automatisés",
      "API complète",
      "Sécurité enterprise",
    ],
  };

  const testimonials = [
    {
      app: "plannikeeper",
      author: "Sophie Martin",
      role: "Directrice Immobilier",
      company: "Patrimoine Léman SA",
      content:
        "PlanniKeeper a révolutionné notre gestion quotidienne. L'interface intuitive et la collaboration d'équipe nous ont fait gagner 40% de temps.",
      rating: 5,
    },
    {
      app: "chaff",
      author: "Marc Dubois",
      role: "Directeur Financier",
      company: "TechSwiss Solutions",
      content:
        "Chaff nous donne une vision claire de notre performance. Les insights prédictifs nous aident à anticiper les tendances du marché.",
      rating: 5,
    },
  ];

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
              Nos Solutions SaaS
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Deux applications, un objectif :
              <br />
              <span className="text-primary">optimiser votre performance</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez PlanniKeeper et Chaff, nos solutions SaaS spécialement
              conçues pour répondre aux défis modernes de la gestion immobilière
              et de l&apos;analyse business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Applications Overview - Version sobre */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* PlanniKeeper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-br from-slate-50 to-primary/5 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-slate-100 text-slate-700"
                      >
                        Gestion Immobilière
                      </Badge>
                      <h3 className="text-2xl font-bold text-slate-900">
                        PlanniKeeper
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6">
                    La solution complète pour gérer efficacement vos projets
                    immobiliers, vos tâches et vos documents dans une interface
                    intuitive et collaborative.
                  </p>
                </div>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Fonctionnalités principales
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {features.plannikeeper.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
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
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/applications/plannikeeper">
                        En savoir plus
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chaff */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-slate-100 text-slate-700"
                      >
                        Analytics Business
                      </Badge>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Chaff
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Plateforme d&apos;analyse business avancée pour transformer
                    vos données en insights stratégiques et prendre des
                    décisions éclairées.
                  </p>
                </div>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Fonctionnalités principales
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {features.chaff.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
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
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/applications/chaff">En savoir plus</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités détaillées
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Découvrez toutes les capacités de nos applications pour optimiser
              votre productivité.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* PlanniKeeper Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  PlanniKeeper - Toutes les fonctionnalités
                </h3>
              </div>
              <div className="space-y-4">
                {features.plannikeeper.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chaff Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Chaff - Toutes les fonctionnalités
                </h3>
              </div>
              <div className="space-y-4">
                {features.chaff.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Découvrez comment nos solutions transforment le quotidien des
              professionnels suisses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {testimonial.app === "plannikeeper" ? (
                          <Building2 className="h-6 w-6 text-primary" />
                        ) : (
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </CardContent>
                </Card>
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
              Prêt à optimiser votre activité ?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Découvrez comment nos solutions peuvent transformer votre
              quotidien professionnel et booster votre productivité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8"
                asChild
              >
                <Link href="/contact">
                  Demander une démo
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
