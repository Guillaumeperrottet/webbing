"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./animated-number";
import { FadeInWhenVisible, StaggerContainer } from "./motion-components";

const stats = [
  {
    value: 150,
    suffix: "+",
    label: "Clients satisfaits",
    description: "Professionnels qui nous font confiance",
  },
  {
    value: 99,
    suffix: "%",
    label: "Uptime garanti",
    description: "Disponibilité de nos services",
  },
  {
    value: 24,
    suffix: "h",
    label: "Support réactif",
    description: "Assistance technique continue",
  },
  {
    value: 5,
    suffix: " ans",
    label: "D'expertise",
    description: "Dans le développement SaaS",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto max-w-6xl">
        <FadeInWhenVisible className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Des chiffres qui parlent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre engagement se mesure par la satisfaction de nos clients et la
            qualité de nos services.
          </p>
        </FadeInWhenVisible>

        <StaggerContainer staggerDelay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  <div className="mb-4">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-4xl md:text-5xl font-bold text-gradient-swiss block"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
