"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Sparkles,
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
      "Analyses prédictives",
      "Visualisations avancées",
      "Exports faciles",
      "Sécurité enterprise",
    ],
    selfkey: [
      "Check-in 24h/24 par QR code",
      "Paiement sécurisé Stripe, TWINT, Apple Pay",
      "Accès automatique après paiement",
      "Installation rapide et intuitive",
      "Conformité RGPD et sécurité suisse",
      "Gestion des arrivées et départs",
      "Support client réactif",
      "Interface mobile et tablette",
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Amélioré avec stats et CTA plus visible */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm bg-primary/5 border-primary/20 text-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Nos Solutions SaaS
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Notre objectif :
                <br />
                <span className="text-primary">optimiser vos performances</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                Découvrez PlanniKeeper, Chaff et Selfkey nos solutions SaaS
                spécialement conçues pour répondre aux défis modernes de la
                gestion de tâches, de l&apos;analyse business et du check-in
                automatique.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications Overview - Amélioré avec hover effects */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trois solutions, une vision
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Chaque application répond à des besoins spécifiques tout en
              s&apos;intégrant parfaitement dans votre écosystème digital.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* PlanniKeeper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="flex flex-col h-full border-[#f3f4f6] shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="bg-[#fff7ed] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fde68a] rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-[#f97316]/10 rounded-xl group-hover:bg-[#f97316]/20 transition-colors">
                      <Building2 className="h-8 w-8 text-[#f97316]" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-[#fde68a] text-[#f97316] border-[#f97316]/20"
                      >
                        Gestion Immobilière
                      </Badge>
                      <h3 className="text-2xl font-bold text-[#b45309]">
                        PlanniKeeper
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#b45309] mb-6 min-h-[72px] relative z-10">
                    La solution complète pour gérer efficacement vos projets
                    immobiliers, vos tâches et vos documents dans une interface
                    intuitive et collaborative.
                  </p>
                </div>
                <CardContent className="flex flex-col flex-1 pt-6">
                  <h4 className="font-semibold text-[#b45309] mb-4">
                    Fonctionnalités clés
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mb-8 flex-1">
                    {features.plannikeeper.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-[#f97316] flex-shrink-0" />
                        <span className="text-sm text-[#b45309]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-[#f97316] group-hover:text-white group-hover:border-[#f97316] transition-colors border-[#f97316]/40 text-[#f97316]"
                      asChild
                    >
                      <Link
                        href="https://www.plannikeeper.ch/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Découvrir
                        <ExternalLink className="ml-2 h-3 w-3" />
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
              className="group"
            >
              <Card className="flex flex-col h-full border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-blue-100 text-blue-700 border-blue-200"
                      >
                        Analytics Business
                      </Badge>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Chaff
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 min-h-[72px] relative z-10">
                    Plateforme d&apos;analyse business avancée pour transformer
                    vos données en insights stratégiques et prendre des
                    décisions éclairées.
                  </p>
                </div>
                <CardContent className="flex flex-col flex-1 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Fonctionnalités clés
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mb-8 flex-1">
                    {features.chaff.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                      asChild
                    >
                      <Link
                        href="https://www.chaff.ch/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Découvrir
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Selfkey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="flex flex-col h-full border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-300/30 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-slate-200 text-slate-800 border-slate-300"
                      >
                        Check-in automatique
                      </Badge>
                      <h3 className="text-2xl font-bold text-slate-900">
                        Selfkey
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 min-h-[72px] relative z-10">
                    Solution de check-in automatique 24h/24 : vos clients
                    s&apos;enregistrent, paient et accèdent à leur hébergement
                    sans intervention.
                  </p>
                </div>
                <CardContent className="flex flex-col flex-1 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Fonctionnalités clés
                  </h4>
                  <div className="grid grid-cols-1 gap-3 mb-8 flex-1">
                    {features.selfkey.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-slate-800 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800 transition-colors"
                      asChild
                    >
                      <Link
                        href="https://www.selfkey.ch/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Découvrir
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Bénéfices - Nouveau */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir nos solutions ?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des avantages concrets pour votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Gain de temps",
                description:
                  "Automatisez vos tâches répétitives et concentrez-vous sur l'essentiel",
                icon: "⏰",
              },
              {
                title: "Sécurité suisse",
                description:
                  "Conformité RGPD et hébergement en Suisse pour une sécurité optimale",
                icon: "🔒",
              },
              {
                title: "Support réactif",
                description:
                  "Une équipe locale disponible pour vous accompagner",
                icon: "🤝",
              },
              {
                title: "Intégration facile",
                description:
                  "Installation rapide et intégration avec vos outils existants",
                icon: "🔧",
              },
              {
                title: "Évolutivité",
                description:
                  "Solutions qui s'adaptent à la croissance de votre entreprise",
                icon: "📈",
              },
              {
                title: "Innovation continue",
                description:
                  "Mises à jour régulières et nouvelles fonctionnalités",
                icon: "💡",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features - Simplifié */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Découvrez toutes les capacités de nos applications
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* PlanniKeeper Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    PlanniKeeper
                  </h3>
                  <p className="text-slate-600">Gestion immobilière complète</p>
                </div>
              </div>
              <div className="space-y-3">
                {features.plannikeeper.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chaff Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Chaff</h3>
                  <p className="text-slate-600">Analytics business avancé</p>
                </div>
              </div>
              <div className="space-y-3">
                {features.chaff.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Selfkey Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-slate-800 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Selfkey</h3>
                  <p className="text-slate-600">Check-in automatique 24/7</p>
                </div>
              </div>
              <div className="space-y-3">
                {features.selfkey.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-slate-800 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Amélioré */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
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
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Rejoignez les entreprises qui font confiance à nos solutions pour
              optimiser leur productivité.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-6 py-3 font-semibold"
                asChild
              >
                <Link
                  href="https://www.plannikeeper.ch/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PlanniKeeper
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-6 py-3 font-semibold"
                asChild
              >
                <Link
                  href="https://www.chaff.ch/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chaff
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-6 py-3 font-semibold"
                asChild
              >
                <Link
                  href="https://www.selfkey.ch/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Selfkey
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
