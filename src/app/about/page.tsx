// app/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { WaveSeparator } from "@/components/ui/wave-separator";
import { BarChart3, Target, Globe, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Image de fond avec titre en overlay */}
      <div className="relative">
        <WaveSeparator
          imageSrc="/background_about.jpg"
          imageAlt="À propos de Webbing"
          imageHeight={600}
          fillColor="#ffffff"
          className="mb-0"
        />
        <div className="absolute inset-0 flex items-start justify-center pt-24 sm:pt-28 md:pt-36 lg:pt-44">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white font-display text-center drop-shadow-lg px-4">
            À propos
          </h1>
        </div>
      </div>

      {/* Phrase introductive */}
      <p className="relative z-10 -mt-10 mb-8 text-center text-base text-muted-foreground sm:-mt-16 md:-mt-20 lg:-mt-28 md:mb-12 md:text-lg">
        Nous créons des applications et sites internet modernes qui grandissent
        avec votre entreprise.
      </p>

      {/* Contenu principal - Image + texte condensé */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
          >
            {/* Image */}
            <div className="relative">
              <Image
                src="/guillaume-perrottet.jpg"
                alt="Guillaume Perrottet"
                width={600}
                height={700}
                className="w-full max-w-sm mx-auto h-auto object-cover rounded-2xl shadow-lg"
                priority
              />
            </div>

            {/* Texte condensé */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-2">
                  Guillaume Perrottet
                </h2>
              </div>

              <div className="w-12 h-0.5 bg-primary rounded-full"></div>

              <p className="text-muted-foreground leading-relaxed">
                Né d&apos;un constat simple : internet évolue vite, trop vite
                pour les solutions figées. Webbing développe des applications et
                sites internet modernes qui grandissent avec votre entreprise et
                suivent le rythme de l&apos;innovation.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    icon: Target,
                    title: "Sur mesure",
                    desc: "Chaque projet est unique, chaque solution est adaptée.",
                  },
                  {
                    icon: Shield,
                    title: "Proximité",
                    desc: "Communication directe et transparente à chaque étape.",
                  },
                  {
                    icon: Globe,
                    title: "Innovation",
                    desc: "Technologies modernes, hébergées en Suisse 🇨🇭.",
                  },
                  {
                    icon: BarChart3,
                    title: "Accompagnement",
                    desc: "De l'idée au lancement, et bien au-delà.",
                  },
                ].map((v, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <v.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">
                        {v.title} —{" "}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {v.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Nous contacter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
