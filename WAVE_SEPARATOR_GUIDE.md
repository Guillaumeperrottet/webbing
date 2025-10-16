# Guide d'utilisation : Composant WaveSeparator

## Vue d'ensemble

Le composant `WaveSeparator` crée un effet de vague responsive pour séparer des sections de votre site. Il suit la technique décrite dans votre guide avec :

- Une image de fond responsive
- Une vague SVG qui s'adapte à toutes les tailles d'écran
- Un système de positionnement absolu pour superposer la vague sur l'image

## Technique utilisée

### 1. Structure HTML

```tsx
<div className="hero_image">
  <Image src={hero} alt="hero" />
  <svg><!-- Forme de vague --></svg>
</div>
```

### 2. Le Secret : SVG + Position Absolute

**L'Image :**

- `w-full` : Prend toute la largeur
- `h-[600px]` : Hauteur fixe
- `object-cover` : Garde les proportions sans déformation

**Le SVG (la vague) :**

- `position: absolute` : Positionné par-dessus l'image
- `bottom: -10px` : Collé en bas avec un léger décalage négatif pour éviter les espaces blancs
- `width: 100%` : S'étire sur toute la largeur
- `fill="#ffffff"` : Couleur de la vague (blanc ici)

### 3. Le viewBox SVG : La Magie du Responsive

```tsx
<svg viewBox="0 0 1440 320">
```

Le `viewBox` définit un système de coordonnées virtuel :

- La forme est dessinée dans un espace de 1440×320
- Le SVG s'adapte automatiquement à la taille du conteneur
- La vague se redimensionne proportionnellement quelle que soit la taille de l'écran

### 4. Le Path (la forme de la vague)

```tsx
<path d="M0,224L80,202.7C160,181,320,139,480,138.7..." />
```

Cette chaîne définit les points de la courbe :

- `M0,224` : point de départ
- `L80,202.7` : ligne vers ce point
- `C...` : courbes de Bézier pour créer l'ondulation

### 5. Responsive avec Tailwind

```tsx
bottom-[-10px]        /* Mobile */
lg:bottom-[-50px]     /* Desktop */
xl:bottom-[-80px]     /* Grand écran */
```

Plus l'écran est grand, plus la vague est décalée vers le bas pour compenser la hauteur du SVG qui s'étire.

### 6. Le Container avec overflow-hidden

```tsx
<div className="hero_image relative md:overflow-hidden">
```

Sur desktop, cache la partie de la vague qui dépasse pour un effet propre.

## Utilisation

### Import

```tsx
import { WaveSeparator } from "@/components/ui/wave-separator";
```

### Exemple basique

```tsx
<WaveSeparator
  imageSrc="/campus-gerance.jpg"
  imageAlt="Campus Gérance - Intérieur moderne"
/>
```

### Exemple avec toutes les options

```tsx
<WaveSeparator
  imageSrc="/campus-gerance.jpg"
  imageAlt="Campus Gérance"
  imageHeight={700}
  fillColor="#f9fafb"
  className="my-8"
/>
```

## Props

| Prop          | Type   | Défaut                     | Description                                            |
| ------------- | ------ | -------------------------- | ------------------------------------------------------ |
| `imageSrc`    | string | `"/hero-image.jpg"`        | Chemin vers l'image de fond                            |
| `imageAlt`    | string | `"hero"`                   | Texte alternatif de l'image                            |
| `imageHeight` | number | `600`                      | Hauteur de l'image en pixels                           |
| `fillColor`   | string | `"hsl(var(--background))"` | Couleur de la vague (doit matcher la section suivante) |
| `className`   | string | `""`                       | Classes CSS additionnelles                             |

## Points importants

### ⚠️ Couleur de la vague

La propriété `fillColor` doit correspondre à la couleur de fond de la section qui suit la vague. Par exemple :

```tsx
{/* Section avec fond blanc */}
<WaveSeparator fillColor="#ffffff" />

{/* Section avec fond gris clair */}
<section className="bg-gray-50">
  ...
</section>
<WaveSeparator fillColor="#f9fafb" />

{/* Section avec couleur du thème */}
<WaveSeparator fillColor="hsl(var(--background))" />
```

### 📱 Responsive

Le composant s'adapte automatiquement :

- **Mobile** : Vague plus proche du bas
- **Tablette/Desktop** : Vague plus décalée pour compenser la hauteur
- **Overflow caché sur desktop** : Pour un effet propre

### 🎨 Personnalisation de la forme

Pour créer votre propre forme de vague, modifiez l'attribut `d` du `path` dans le composant. Vous pouvez utiliser des outils en ligne comme :

- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/)
- [Getwaves.io](https://getwaves.io/)

## Exemples d'utilisation

### Cas 1 : Hero avec vague

```tsx
export default function HomePage() {
  return (
    <div>
      <WaveSeparator
        imageSrc="/hero-home.jpg"
        imageAlt="Notre équipe"
        imageHeight={600}
      />

      <section className="py-20">
        <h2>Nos services</h2>
        {/* Contenu... */}
      </section>
    </div>
  );
}
```

### Cas 2 : Entre deux sections

```tsx
<section className="bg-blue-500 text-white py-20">
  <h2>Section bleue</h2>
</section>

<WaveSeparator
  imageSrc="/transition.jpg"
  fillColor="#ffffff"
  imageHeight={400}
/>

<section className="bg-white py-20">
  <h2>Section blanche</h2>
</section>
```

### Cas 3 : Vague inversée (en haut)

Pour créer une vague en haut d'une section, vous pouvez :

1. Créer un composant `WaveSeparatorTop`
2. Changer `bottom` par `top` dans le positionnement
3. Inverser le path SVG (transformation rotate ou scale)

## Avantages de cette technique

✅ **Responsive** : S'adapte à toutes les tailles d'écran  
✅ **Léger** : SVG optimisé, pas d'image lourde  
✅ **Flexible** : Facile à personnaliser  
✅ **Performance** : Utilise Next.js Image pour l'optimisation  
✅ **Accessible** : Alt text et balises sémantiques

## Dépannage

### La vague ne touche pas l'image

Ajustez le `bottom` avec des valeurs négatives plus importantes :

```tsx
className = "... bottom-[-20px] lg:bottom-[-60px]";
```

### Espace blanc visible

Assurez-vous que :

1. Le `fillColor` correspond exactement à la couleur de fond suivante
2. Le conteneur parent a `overflow-hidden`
3. Il n'y a pas de margin/padding qui créent des espaces

### L'image est déformée

Vérifiez que vous utilisez bien `object-cover` sur l'image.
