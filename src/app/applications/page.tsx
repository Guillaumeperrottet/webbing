"use client";

import { Hero, Section, Container } from "@/components/ui/webbing-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Sparkles,
  Tent,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const applications = [
  {
    name: "PlanniKeeper",
    category: "Gestion Immobilière",
    tagline: "Organisez • Planifiez • Maîtrisez",
    description:
      "Gestion efficace de vos tâches liées à vos biens immobiliers dans une interface intuitive et élégante.",
    icon: Building2,
    url: "https://www.plannikeeper.ch/",
    color: "orange", // Couleur orange comme PlanniKeeper
    featured: true,
    features: [
      "Visualisation interactive de vos biens immobiliers",
      "Gestion des tâches simplifiée et centralisée",
      "Mode collaboratif en temps réel avec votre équipe",
      "Centralisation documentaire complète",
      "Communication facilitée avec assignation de tâches",
      "Notifications automatiques et historique",
      "Interface mobile optimisée",
      "Mises à jour automatiques et fonctionnalités sur demande",
    ],
    stats: [
      { label: "Propriétés gérées", value: "500+" },
      { label: "Utilisateurs actifs", value: "150+" },
      { label: "Tâches automatisées", value: "10k+" },
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
    color: "blue", // Couleur bleue pour l'analytics
    featured: false,
    features: [
      "Analytics en temps réel avec graphiques interactifs",
      "Suivi quotidien du chiffre d'affaires",
      "Gestion et analyse de la masse salariale",
      "Calcul des ratios de rentabilité par période",
      "Tableaux de bord intuitifs personnalisables",
      "Chiffrement end-to-end pour la sécurité",
      "Hébergement européen conforme RGPD",
      "Évolution continue avec nouvelles fonctionnalités sur demande",
    ],
    stats: [
      { label: "Données analysées", value: "1M+" },
      { label: "Rapports générés", value: "5k+" },
      { label: "Précision", value: "99%" },
    ],
  },
  {
    name: "SelfKey",
    category: "Check-in automatique",
    tagline: "Enregistrez • Payez • Accédez",
    description:
      "Solution de check-in automatique 24h/24 : vos clients s'enregistrent, paient et accèdent à leur hébergement sans intervention.",
    icon: CheckCircle,
    url: "https://www.selfkey.ch/",
    color: "gray", // Couleur grise pour SelfKey
    featured: true,
    features: [
      "Check-in 24h/24 par code QR",
      "Paiement sécurisé Stripe (cartes, TWINT, Apple Pay, Google Pay)",
      "Envoi automatique des codes d'accès par email après paiement",
      "Installation rapide et configuration simple",
      "Basé en Suisse avec conformité RGPD garantie",
      "Interface intuitive pour établissements et clients",
      "Améliorations continues et personnalisations sur demande",
    ],
    stats: [
      { label: "Check-ins automatiques", value: "50k+" },
      { label: "Taux de satisfaction", value: "98%" },
      { label: "Hébergements connectés", value: "200+" },
    ],
  },
  {
    name: "SelfCamp",
    category: "Solution Camping",
    tagline: "Réservez • Campez • Profitez",
    description:
      "Solution complète de check-in automatique pour campings, hôtels, parkings et locations saisonnières. Vos clients réservent 24h/24 en scannant un QR code, paient en ligne et accèdent instantanément à leur emplacement.",
    icon: Tent,
    url: "https://www.selfcamp.ch/",
    color: "green", // Couleur verte pour camping/nature
    featured: true,
    features: [
      "Check-in automatique 24h/24",
      "QR code simple : scan, paiement, accès instantané",
      "Paiement sécurisé Stripe : cartes, TWINT, Apple Pay, Google Pay",
      "Gestion parking intégrée",
      "Installation rapide : prêt en 5 minutes",
      "Aucune application, compte ou abonnement nécessaire pour l'utilisateur",
      "Parfait pour hôtels, campings, parkings et locations",
    ],
    stats: [
      { label: "Installation", value: "5 min" },
      { label: "Disponibilité", value: "24/7" },
      { label: "Satisfaction", value: "98%" },
    ],
  },
];

const values = [
  {
    icon: Zap,
    title: "Performance",
    description:
      "Des applications ultra-rapides et optimisées pour votre productivité quotidienne.",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description:
      "Vos données sont protégées selon les standards suisses les plus exigeants.",
  },
  {
    icon: Users,
    title: "Support",
    description:
      "Une équipe dédiée pour vous accompagner dans votre transformation digitale.",
  },
  {
    icon: Sparkles,
    title: "Simplicité",
    description:
      "Aucune installation logiciel requise. Accès web immédiat et possibilité de se désabonner à tout moment.",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section moderne */}
      <Hero
        badge="Nos Applications"
        description="Applications web que nos clients utilisent au quotidien. Développées en Suisse."
      />

      {/* Section Applications principales */}
      <Section id="applications">
        <Container>
          <div className="space-y-24">
            {applications.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={
                  index % 2 === 1
                    ? "flex flex-col lg:flex-row-reverse gap-12"
                    : "flex flex-col lg:flex-row gap-12"
                }
              >
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant="outline">{app.category}</Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        app.color === "orange"
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : app.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : app.color === "gray"
                              ? "bg-gray-100 dark:bg-gray-900/20"
                              : "bg-muted"
                      }`}
                    >
                      <app.icon
                        className={`h-8 w-8 ${
                          app.color === "orange"
                            ? "text-orange-600 dark:text-orange-400"
                            : app.color === "blue"
                              ? "text-blue-600 dark:text-blue-400"
                              : app.color === "gray"
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-primary"
                        }`}
                      />
                    </div>
                    <h2 className="text-4xl font-bold text-foreground">
                      {app.name}
                    </h2>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wide">
                    {app.tagline}
                  </p>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {app.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1" asChild>
                      <Link
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Découvrir {app.name}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="bg-muted/30 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Fonctionnalités principales
                    </h3>
                    <div className="grid gap-3">
                      {app.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 ${
                              app.color === "orange"
                                ? "bg-orange-500"
                                : app.color === "blue"
                                  ? "bg-blue-500"
                                  : app.color === "gray"
                                    ? "bg-gray-500"
                                    : "bg-primary"
                            }`}
                          ></div>
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section Valeurs */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir nos solutions ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous mettons la technologie au service de votre réussite avec des
              solutions pensées pour les professionnels exigeants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-background border border-border rounded-2xl mb-6 shadow-sm">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-muted/50 to-muted/30 pt-16">
        <Container size="lg">
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
        </Container>
      </Section>
    </div>
  );
}
