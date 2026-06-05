# Guide des logos et icônes - Webbing

## 🎨 Fichiers à créer

### 1. **Favicon et icônes de base**

#### À placer dans `/public/`

**favicon.ico**

- Tailles multiples : 16x16, 32x32, 48x48 px
- Format : ICO
- Outil recommandé : https://realfavicongenerator.net/
- Utilisé pour : Onglet du navigateur

**logo.png**

- Taille : 512x512 px minimum
- Format : PNG avec fond transparent
- Usage : Logo principal, Google Business Profile, Schema.org
- Recommandation : Carré, design simple et reconnaissable

**og-image.jpg**

- Taille : 1200x630 px (ratio 1.91:1)
- Format : JPG ou PNG
- Usage : Partage sur réseaux sociaux (Facebook, LinkedIn, Twitter)
- Contenu suggéré : Logo + slogan "Solutions web suisses"

**apple-touch-icon.png**

- Taille : 180x180 px
- Format : PNG
- Usage : Icône iOS quand on ajoute le site à l'écran d'accueil

### 2. **PWA Icons (Progressive Web App)**

**icon-192.png**

- Taille : 192x192 px
- Format : PNG avec fond
- Usage : Icône app Android/Chrome

**icon-512.png**

- Taille : 512x512 px
- Format : PNG avec fond
- Usage : Splash screen, icône haute résolution

### 3. **Icônes générées automatiquement**

✅ **Déjà créé** :

- `/src/app/icon.tsx` - Génère favicon 32x32
- `/src/app/apple-icon.tsx` - Génère icône iOS 180x180

Ces fichiers génèrent automatiquement un "W" blanc sur fond noir. Vous pouvez les personnaliser avec votre vraie logo.

## 🛠️ Outils recommandés

### Design des logos

- **Figma** (gratuit) - Design vectoriel
- **Canva** - Templates de logo
- **Adobe Express** - Création rapide

### Génération des favicons

- **RealFaviconGenerator** - https://realfavicongenerator.net/
  - Upload votre logo
  - Génère tous les formats nécessaires
  - Donne le code HTML à intégrer

### Optimisation des images

- **TinyPNG** - https://tinypng.com/ (compression PNG)
- **Squoosh** - https://squoosh.app/ (compression et conversion)

## 📐 Spécifications design

### Couleurs Webbing (à adapter selon votre charte)

- Primaire : Noir (#000000) ou votre couleur brand
- Secondaire : Blanc (#FFFFFF)
- Accent : Votre couleur primary du site

### Style recommandé

- **Simple** : Fonctionne à toutes les tailles
- **Reconnaissable** : Identifiable même en 16x16
- **Carré** : Évitez les formes trop rectangulaires
- **Contraste** : Lisible sur fond clair et foncé

## 📋 Checklist de création

- [ ] Créer le logo principal 512x512 px
- [ ] Créer logo.png et placer dans /public/
- [ ] Générer favicon.ico avec RealFaviconGenerator
- [x] Créer og-image.jpg (1200x630 px)
- [x] Créer icon-192.png
- [x] Créer icon-512.png
- [ ] Créer apple-touch-icon.png (180x180 px)
- [ ] Tester sur https://www.websiteplanet.com/webtools/favicon-tester/

## 🎯 Exemple de structure finale

```
/public
├── favicon.ico          ✅ Favicon navigateur
├── logo.png            ✅ Logo principal (512x512)
├── og-image.jpg        ✅ Image réseaux sociaux (1200x630)
├── apple-touch-icon.png ✅ Icône iOS (180x180)
├── icon-192.png        ✅ PWA petit (192x192)
└── icon-512.png        ✅ PWA grand (512x512)

/src/app
├── icon.tsx            ✅ Génère favicon dynamique
└── apple-icon.tsx      ✅ Génère icône Apple dynamique
```

## 📱 Test de visibilité

### Dans Google Search

1. Assurez-vous que `logo.png` est présent dans /public/
2. Le Schema.org pointe vers cette image
3. Ajoutez votre site à Google Business Profile
4. Cela peut prendre 1-2 semaines avant d'apparaître

### Dans la barre d'adresse

1. Le `favicon.ico` doit être dans /public/
2. Ou utilisez les fichiers générés par icon.tsx
3. Vide le cache du navigateur pour tester

### Sur mobile (ajout à l'écran d'accueil)

1. Le `apple-touch-icon.png` s'affiche sur iOS
2. Les `icon-192.png` et `icon-512.png` sur Android

## 💡 Conseils

1. **Gardez la simplicité** : Un logo simple est plus efficace en petit
2. **Testez à toutes les tailles** : Vérifiez la lisibilité à 16x16
3. **Utilisez des couleurs contrastées** : Pour la visibilité
4. **Optimisez le poids** : Gardez les fichiers légers (< 100KB)

## 🔄 Personnalisation des fichiers générés

Pour personnaliser icon.tsx et apple-icon.tsx avec votre vrai logo :

- Remplacez le contenu par une image
- Ou gardez le "W" mais customisez les couleurs/style
- Ou utilisez directement des fichiers PNG statiques

---

Une fois tous ces fichiers créés et placés, votre site aura une identité visuelle complète sur tous les supports ! 🎨
