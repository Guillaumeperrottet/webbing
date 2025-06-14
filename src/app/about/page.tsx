// app/about/page.tsx
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
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Notre histoire
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nous créons des solutions qui transforment les entreprises
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Basée en Suisse, Webbing développe des applications SaaS innovantes
            qui simplifient les processus complexes et optimisent la performance
            des entreprises modernes.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                Notre mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Simplifier le complexe, optimiser l&apos;essentiel
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
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
              <Button asChild>
                <Link href="/contact">
                  Découvrir nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Vision</h3>
                  <p className="text-sm text-slate-600">
                    Être le partenaire technologique de référence pour les
                    entreprises suisses
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Qualité</h3>
                  <p className="text-sm text-slate-600">
                    Standards suisses d&apos;excellence appliqués à chaque
                    projet
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Humain</h3>
                  <p className="text-sm text-slate-600">
                    L&apos;utilisateur au centre de chaque décision de
                    conception
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Innovation
                  </h3>
                  <p className="text-sm text-slate-600">
                    Technologies de pointe pour des solutions d&apos;avenir
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solutions Deep Dive */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos solutions en détail
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Deux applications complémentaires nées de notre expertise et de
              notre compréhension des besoins du marché suisse.
            </p>
          </div>

          <div className="space-y-12">
            {/* PlanniKeeper Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge variant="secondary">Gestion Immobilière</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  PlanniKeeper
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Née de la frustration face à la complexité des outils de
                  gestion immobilière existants, PlanniKeeper révolutionne la
                  façon dont les professionnels gèrent leurs biens. Interface
                  intuitive, collaboration fluide et organisation parfaite des
                  documents.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Interface cartographique interactive pour visualiser le
                      portefeuille
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Système de tâches intégré avec notifications intelligentes
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Collaboration d&apos;équipe en temps réel avec gestion des
                      permissions
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Centralisation et organisation automatique des documents
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link
                      href="https://www.plannikeeper.ch/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visiter le site
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/applications/plannikeeper">
                      En savoir plus
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-12 w-12 text-green-600" />
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
            </div>

            {/* Chaff Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center lg:order-first">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge variant="secondary">Analytics Business</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Chaff
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Dans un monde où les données sont partout mais les insights
                  rares, Chaff transforme vos données brutes en intelligence
                  stratégique. Tableaux de bord dynamiques, analyses prédictives
                  et alertes proactives.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Tableaux de bord personnalisables avec mise à jour en
                      temps réel
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Analyses prédictives basées sur l&apos;intelligence
                      artificielle
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Intégration native avec vos sources de données existantes
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Alertes automatisées et notifications intelligentes
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link
                      href="https://www.chaff.ch/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visiter le site
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/applications/chaff">En savoir plus</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Approach */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Notre approche technologique
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nous combinons les meilleures pratiques de développement avec une
              veille technologique constante pour créer des solutions robustes
              et évolutives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Qualité suisse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Tests automatisés, code reviews systématiques, et déploiements
                  sécurisés. Nous appliquons les standards de qualité suisses à
                  chaque étape.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    CI/CD
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Tests
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Security
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Performance
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Centré utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Recherche utilisateur, prototypage itératif, et feedback
                  continu. Chaque fonctionnalité est conçue pour résoudre un
                  problème réel.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">
                    UX Research
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Prototyping
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    User Testing
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Analytics
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values & Commitments */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos engagements
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Au-delà de la technologie, nous nous engageons sur des valeurs qui
              guident chacune de nos décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Transparence
              </h3>
              <p className="text-slate-600 text-sm">
                Tarification claire, roadmap ouverte, et communication honnête
                sur les capacités et limitations de nos solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Sécurité
              </h3>
              <p className="text-slate-600 text-sm">
                Conformité RGPD, chiffrement end-to-end, et hébergement en
                Suisse pour protéger vos données les plus sensibles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Accompagnement
              </h3>
              <p className="text-slate-600 text-sm">
                Formation complète, support réactif, et conseils stratégiques
                pour maximiser la valeur de nos solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Innovation
              </h3>
              <p className="text-slate-600 text-sm">
                Veille technologique constante et amélioration continue pour
                rester à la pointe de l&apos;innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à découvrir nos solutions ?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Parlons de votre projet et voyons comment nos solutions peuvent
            transformer votre activité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100"
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
              className="border-slate-600 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
