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
  Building2,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
// import Image from "next/image"

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
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Nos Solutions SaaS
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Deux applications, un objectif :
            <br />
            <span className="text-primary-foreground/90">
              optimiser votre performance
            </span>
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Découvrez PlanniKeeper et Chaff, nos solutions SaaS spécialement
            conçues pour répondre aux défis modernes de la gestion immobilière
            et de l&apos;analyse business.
          </p>
        </div>
      </section>

      {/* Applications Overview */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* PlanniKeeper */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Gestion Immobilière
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground">
                      PlanniKeeper
                    </h2>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  La solution complète pour gérer efficacement vos projets
                  immobiliers, vos tâches et vos documents dans une interface
                  moderne et intuitive.
                </p>

                {/* Key Features */}
                <div className="space-y-3 mb-8">
                  {features.plannikeeper.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
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
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/applications/plannikeeper">
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Chaff */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Analytics Business
                    </Badge>
                    <h2 className="text-2xl font-bold text-slate-900">Chaff</h2>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Plateforme d&apos;analyse business avancée pour transformer
                  vos données en insights stratégiques et prendre des décisions
                  éclairées.
                </p>

                {/* Key Features */}
                <div className="space-y-3 mb-8">
                  {features.chaff.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
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
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/applications/chaff">
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features Comparison */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez en détail toutes les fonctionnalités qui font de nos
              applications des solutions incontournables pour votre activité.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* PlanniKeeper Features */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-xl">
                    PlanniKeeper - Fonctionnalités
                  </CardTitle>
                </div>
                <CardDescription>
                  Tout ce dont vous avez besoin pour une gestion immobilière
                  efficace
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-3">
                  {features.plannikeeper.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chaff Features */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">
                    Chaff - Fonctionnalités
                  </CardTitle>
                </div>
                <CardDescription>
                  Analyse business avancée pour des décisions stratégiques
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-3">
                  {features.chaff.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez ce que nos clients disent de nos solutions et comment
              elles transforment leur quotidien professionnel.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        testimonial.app === "plannikeeper"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {testimonial.app === "plannikeeper" ? (
                        <Building2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <Badge variant="outline">
                      {testimonial.app === "plannikeeper"
                        ? "PlanniKeeper"
                        : "Chaff"}
                    </Badge>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-slate-700 mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </blockquote>
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900">
                      {testimonial.author}
                    </div>
                    <div className="text-slate-600">{testimonial.role}</div>
                    <div className="text-slate-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cas d&apos;usage concrets
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez comment nos solutions s&apos;adaptent à différents
              profils et secteurs d&apos;activité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real Estate Manager */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">
                  Gestionnaire Immobilier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Gérez votre portefeuille de biens, coordonnez les équipes, et
                  suivez les tâches de maintenance avec PlanniKeeper.
                </p>
                <Badge variant="outline" className="text-xs">
                  PlanniKeeper
                </Badge>
              </CardContent>
            </Card>

            {/* Business Analyst */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Analyste Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Créez des tableaux de bord interactifs, analysez les
                  tendances, et générez des insights avec Chaff.
                </p>
                <Badge variant="outline" className="text-xs">
                  Chaff
                </Badge>
              </CardContent>
            </Card>

            {/* Enterprise Manager */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="flex">
                    <Building2 className="h-6 w-6 text-purple-600" />
                    <BarChart3 className="h-6 w-6 text-purple-600 -ml-2" />
                  </div>
                </div>
                <CardTitle className="text-lg">
                  Directeur d&apos;Entreprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">
                  Combinez gestion opérationnelle et analyse stratégique avec
                  nos deux solutions intégrées.
                </p>
                <div className="flex gap-1 justify-center">
                  <Badge variant="outline" className="text-xs">
                    PlanniKeeper
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Chaff
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choisissez la solution qui correspond à vos besoins ou découvrez
            comment nos deux applications peuvent travailler ensemble.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              asChild
            >
              <Link href="/applications/plannikeeper">
                Découvrir PlanniKeeper
                <Building2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/applications/chaff">
                Découvrir Chaff
                <BarChart3 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/contact">Planifier une démo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
