"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

/**
 * Composant Section avec styles prédéfinis
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "dark";
  children: React.ReactNode;
}

export function Section({
  variant = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const variants = {
    default: "bg-background",
    muted: "bg-muted/30",
    dark: "bg-slate-900 text-white",
  };

  return (
    <section
      className={cn("py-16 px-4", variants[variant], className)}
      {...props}
    >
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Composant Container avec différentes tailles
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Container({
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };

  return (
    <div
      className={cn("container mx-auto px-4", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Composant Feature Card optimisé avec shadcn
 */
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  href?: string;
  external?: boolean;
  features?: string[];
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
  href,
  external = false,
  features,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 hover:shadow-lg border-border",
        href && "cursor-pointer hover:border-primary/20",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
              <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          )}
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl text-foreground mb-2">{title}</CardTitle>

        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      {features && (
        <CardContent className="flex flex-col flex-1">
          <ul className="space-y-2 mb-6 flex-1">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>

          {href && (
            <Button
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
              asChild
            >
              <Link
                href={href}
                {...(external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                Découvrir
                {external ? (
                  <ExternalLink className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Link>
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Composant Stats avec design moderne
 */
interface StatProps {
  value: string;
  label: string;
  description?: string;
}

export function Stat({ value, label, description }: StatProps) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
        {value}
      </div>
      <div className="text-lg font-semibold text-foreground mb-1">{label}</div>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  );
}

/**
 * Composant Hero Section moderne
 */
interface HeroProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function Hero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: HeroProps) {
  return (
    <Section variant="default" className={cn("py-24", className)}>
      <Container size="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            {badge && (
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm bg-muted/50 border-border"
              >
                {badge}
              </Badge>
            )}

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction && (
              <Button size="lg" className="text-base px-8" asChild>
                <Link href={primaryAction.href}>
                  {primaryAction.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {secondaryAction && (
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                asChild
              >
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
