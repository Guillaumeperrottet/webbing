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
  color?: string;
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
  color = "primary",
  className,
}: FeatureCardProps) {
  // Mapping des couleurs
  const colorVariants = {
    primary: {
      icon: "group-hover:bg-primary/10 group-hover:text-primary",
      border: "hover:border-primary/20",
      dot: "bg-primary",
      button:
        "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
    },
    orange: {
      icon: "group-hover:bg-orange-50 group-hover:text-orange-600",
      border: "hover:border-orange-200",
      dot: "bg-orange-500",
      button:
        "group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600",
    },
    emerald: {
      icon: "group-hover:bg-emerald-50 group-hover:text-emerald-600",
      border: "hover:border-emerald-200",
      dot: "bg-emerald-500",
      button:
        "group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600",
    },
    blue: {
      icon: "group-hover:bg-blue-50 group-hover:text-blue-600",
      border: "hover:border-blue-200",
      dot: "bg-blue-500",
      button:
        "group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600",
    },
    purple: {
      icon: "group-hover:bg-purple-50 group-hover:text-purple-600",
      border: "hover:border-purple-200",
      dot: "bg-purple-500",
      button:
        "group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600",
    },
    gray: {
      icon: "group-hover:bg-gray-50 group-hover:text-gray-600",
      border: "hover:border-gray-200",
      dot: "bg-gray-500",
      button:
        "group-hover:bg-gray-600 group-hover:text-white group-hover:border-gray-600",
    },
  };

  const selectedColor =
    colorVariants[color as keyof typeof colorVariants] || colorVariants.primary;

  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 hover:shadow-lg border-border h-full flex flex-col",
        href && `cursor-pointer ${selectedColor.border}`,
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div
              className={cn(
                "p-2 bg-muted rounded-lg transition-colors duration-300",
                selectedColor.icon
              )}
            >
              <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300" />
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
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                    selectedColor.dot
                  )}
                ></div>
                {feature}
              </li>
            ))}
          </ul>

          {href && (
            <Button
              variant="outline"
              className={cn(
                "w-full transition-all duration-300",
                selectedColor.button
              )}
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
