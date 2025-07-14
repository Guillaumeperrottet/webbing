# Guide d'utilisation de shadcn/ui dans Webbing

## Configuration complète ✅

Votre application Next.js est maintenant entièrement configurée avec shadcn/ui ! Voici ce qui a été installé et configuré :

### Composants installés

- ✅ **Base** : `button`, `card`, `badge`, `input`, `label`, `textarea`, `select`
- ✅ **Navigation** : `navigation-menu`
- ✅ **Overlays** : `dialog`, `dropdown-menu`, `sheet`, `popover`, `hover-card`
- ✅ **Feedback** : `sonner` (notifications toast modernes)
- ✅ **Layout** : `separator`, `tabs`
- ✅ **Forms** : `form`, `switch`

### Configuration

1. **Variables CSS** : Thème complet défini dans `src/app/globals.css`
2. **Tailwind Config** : Configuration optimisée dans `tailwind.config.ts`
3. **Composants utilitaires** : `src/components/ui/webbing-ui.tsx`
4. **Thème centralisé** : `src/lib/theme.ts`

## Comment utiliser

### 1. Composants de base shadcn/ui

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Utilisation directe
<Button variant="default" size="lg">
  Mon bouton
</Button>

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

### 2. Composants Webbing personnalisés

```tsx
import { Hero, Section, Container, FeatureCard } from "@/components/ui/webbing-ui";

// Hero section moderne
<Hero
  badge="Nouveau"
  title={<>Titre avec <span className="text-primary">accent</span></>}
  description="Description de votre hero"
  primaryAction={{ label: "Action principale", href: "/action" }}
  secondaryAction={{ label: "Action secondaire", href: "/autre" }}
/>

// Section avec container
<Section variant="muted">
  <Container size="lg">
    <h2>Votre contenu</h2>
  </Container>
</Section>

// Carte de fonctionnalité
<FeatureCard
  title="Nom de l'app"
  description="Description de l'application"
  icon={MonIcon}
  badge="Catégorie"
  href="https://example.com"
  external={true}
  features={["Feature 1", "Feature 2"]}
/>
```

### 3. Tokens de couleur shadcn

Au lieu d'utiliser des couleurs Tailwind spécifiques, utilisez les tokens semantic :

```tsx
// ❌ Ancien style
<div className="bg-slate-50 text-slate-900 border-slate-200">

// ✅ Nouveau style shadcn
<div className="bg-muted text-foreground border-border">

// ❌ Ancien style
<h1 className="text-slate-900">Titre</h1>

// ✅ Nouveau style shadcn
<h1 className="text-foreground">Titre</h1>
```

### 4. Tokens disponibles

```css
/* Couleurs principales */
background          /* Arrière-plan principal */
foreground          /* Texte principal */
primary             /* Couleur de marque principale */
primary-foreground  /* Texte sur fond primary */

/* Couleurs secondaires */
secondary           /* Couleur secondaire */
secondary-foreground
muted               /* Arrière-plan atténué */
muted-foreground    /* Texte atténué */
accent              /* Couleur d'accent */
accent-foreground

/* Éléments d'interface */
border              /* Bordures */
input               /* Champs de saisie */
ring                /* Focus ring */
card                /* Cartes */
card-foreground
popover             /* Popovers */
popover-foreground

/* États */
destructive         /* Erreurs/suppression */
destructive-foreground
```

## Exemples pratiques

### Migration d'un composant existant

**Avant (Tailwind classique) :**

```tsx
<div className="bg-white border border-slate-200 rounded-lg p-6">
  <h3 className="text-slate-900 font-semibold mb-4">Titre</h3>
  <p className="text-slate-600">Description</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded">Action</button>
</div>
```

**Après (shadcn/ui) :**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground mb-4">Description</p>
    <Button>Action</Button>
  </CardContent>
</Card>;
```

### Utilisation des variants

```tsx
// Boutons
<Button variant="default">Défaut</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="outline">Contour</Button>
<Button variant="ghost">Fantôme</Button>
<Button variant="destructive">Destructif</Button>

// Tailles
<Button size="sm">Petit</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grand</Button>

// Badges
<Badge variant="default">Défaut</Badge>
<Badge variant="secondary">Secondaire</Badge>
<Badge variant="outline">Contour</Badge>
<Badge variant="destructive">Erreur</Badge>
```

## Avantages

✅ **Cohérence** : Tokens de couleur semantic qui s'adaptent automatiquement
✅ **Maintenabilité** : Un seul endroit pour modifier les couleurs
✅ **Accessibilité** : Composants pré-testés pour l'accessibilité
✅ **Performance** : Composants optimisés avec Radix UI
✅ **Flexibilité** : Système de variants et de props complet
✅ **Documentation** : Composants bien documentés sur ui.shadcn.com

## Prochaines étapes

1. Migrez progressivement vos composants existants vers shadcn/ui
2. Utilisez les composants `webbing-ui.tsx` pour les patterns récurrents
3. Ajoutez d'autres composants shadcn/ui selon vos besoins :
   ```bash
   npx shadcn@latest add [component-name]
   ```

Votre application est maintenant prête à utiliser pleinement l'écosystème shadcn/ui ! 🎉
