// app/page.tsx
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
// import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="outline">
              Solutions SaaS Suisses
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Des applications qui
              <span className="text-primary"> transforment </span>
              votre activité
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Nous développons des solutions SaaS innovantes pour simplifier la
              gestion immobilière et optimiser vos analyses business. Découvrez
              nos applications conçues en Suisse avec une attention particulière
              à la qualité et à l&apos;efficacité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link href="/applications">
                  Découvrir nos applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deux applications spécialisées pour répondre aux défis modernes
              des professionnels de l&apos;immobilier et de l&apos;analyse
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* PlanniKeeper Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">Gestion Immobilière</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">
                  PlanniKeeper
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  La solution complète pour gérer efficacement vos projets
                  immobiliers, vos tâches et vos documents dans une interface
                  intuitive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Interface interactive pour naviguer entre vos biens
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Système intégré de planification et suivi des tâches
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Collaboration d&apos;équipe en temps réel
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Gestion centralisée des documents
                  </div>
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
              </CardContent>
            </Card>

            {/* Chaff Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <Badge variant="secondary">Analytics Business</Badge>
                </div>
                <CardTitle className="text-2xl text-foreground">Chaff</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Plateforme d&apos;analyse business avancée pour transformer
                  vos données en insights stratégiques et prendre des décisions
                  éclairées.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Tableaux de bord interactifs personnalisables
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Analyse prédictive et modélisation avancée
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Intégration multi-sources de données
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Rapports automatisés et alertes intelligentes
                  </div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir Webbing ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre engagement envers l&apos;excellence se reflète dans chaque
              aspect de nos solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Sécurité Suisse
              </h3>
              <p className="text-muted-foreground">
                Vos données sont hébergées et protégées selon les standards
                suisses les plus stricts en matière de sécurité et de
                confidentialité.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Performance Optimale
              </h3>
              <p className="text-muted-foreground">
                Nos applications sont conçues pour offrir une expérience fluide
                et réactive, même avec de gros volumes de données.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Support Dédié
              </h3>
              <p className="text-muted-foreground">
                Une équipe d&apos;experts à votre écoute pour vous accompagner
                dans l&apos;utilisation et l&apos;optimisation de nos solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Découvrez comment nos solutions peuvent optimiser vos processus et
            accélérer votre croissance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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
