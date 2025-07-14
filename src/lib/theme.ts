/**
 * Configuration centralisée des thèmes et couleurs Webbing
 * Basé sur shadcn/ui avec une palette de couleurs personnalisée
 */

export const colors = {
  // Couleurs principales Webbing
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  success: "hsl(var(--success))",

  // Couleurs de base
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",

  // Composants
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },

  // États
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },

  // Éléments d'interface
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
} as const;

export const spacing = {
  radius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
  },
} as const;

export const gradients = {
  swiss: "var(--gradient-swiss)",
  primary: "var(--gradient-primary)",
} as const;

/**
 * Classes utilitaires prédéfinies pour les composants courants
 */
export const componentStyles = {
  // Styles pour les cartes
  card: {
    base: "bg-card text-card-foreground rounded-lg border shadow-sm",
    hover: "transition-all duration-200 hover:shadow-md",
    interactive:
      "transition-all duration-200 hover:shadow-md hover:border-primary/20",
  },

  // Styles pour les boutons
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },

  // Styles pour les inputs
  input: {
    base: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    disabled: "disabled:cursor-not-allowed disabled:opacity-50",
  },

  // Styles pour la navigation
  nav: {
    link: "text-foreground/60 hover:text-foreground transition-colors",
    active: "text-foreground font-medium",
  },
} as const;

/**
 * Variants de taille standardisées
 */
export const sizes = {
  xs: "h-6 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
} as const;

export type ColorKey = keyof typeof colors;
export type SizeKey = keyof typeof sizes;
