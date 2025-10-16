# Événements Vercel Analytics

Ce document liste tous les événements personnalisés trackés dans l'application avec Vercel Analytics.

## Prérequis

- Package `@vercel/analytics` version 1.5.0 (déjà installé)
- Plan Vercel Pro ou Enterprise (requis pour les événements personnalisés)

## Événements trackés

### 1. Application Click

**Type**: Client-side  
**Localisation**: Page d'accueil (composant `FeatureCard`)  
**Trigger**: Clic sur le bouton "Découvrir" d'une application

**Données personnalisées**:

- `app`: Nom de l'application (ex: "PlanniKeeper", "Chaff", "SelfKey", "SelfCamp")
- `category`: Catégorie de l'application (ex: "Gestion Immobilière", "Analytics Business")

**Utilité**: Mesurer l'intérêt pour chaque application et identifier les plus populaires.

```typescript
track("Application Click", {
  app: "PlanniKeeper",
  category: "Gestion Immobilière",
});
```

---

### 2. CTA Click

**Type**: Client-side  
**Localisation**: Page d'accueil (section CTA en bas de page)  
**Trigger**: Clic sur le bouton "Nous contacter"

**Données personnalisées**:

- `section`: "homepage"
- `action`: "contact_button"

**Utilité**: Mesurer l'efficacité du call-to-action principal de la page d'accueil.

```typescript
track("CTA Click", {
  section: "homepage",
  action: "contact_button",
});
```

---

### 3. Contact Form Submit

**Type**: Client-side  
**Localisation**: Page de contact (`/contact`)  
**Trigger**: Soumission réussie du formulaire de contact

**Données personnalisées**:

- `service`: Service sélectionné dans le formulaire (ou "not_specified")
- `hasCompany`: Boolean indiquant si l'utilisateur a renseigné une entreprise

**Utilité**: Analyser les conversions de formulaire et les types de demandes.

```typescript
track("Contact Form Submit", {
  service: "Développement web",
  hasCompany: true,
});
```

---

### 4. Contact Email Sent

**Type**: Server-side  
**Localisation**: API Route (`/api/contact/route.ts`)  
**Trigger**: Email envoyé avec succès via Resend

**Données personnalisées**:

- `service`: Service demandé (ou "not_specified")
- `hasCompany`: Boolean indiquant si l'utilisateur représente une entreprise

**Utilité**: Confirmer l'envoi effectif d'emails côté serveur et croiser avec les données client.

```typescript
await track("Contact Email Sent", {
  service: "Développement web",
  hasCompany: true,
});
```

---

## Visualisation des données

1. Accédez au [Dashboard Vercel](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Cliquez sur l'onglet **Analytics**
4. Scrollez jusqu'au panel **Events**
5. Cliquez sur un nom d'événement pour voir les détails

## Limitations

- **Nombre de propriétés personnalisées**: Limité selon votre plan Vercel
- **Objets imbriqués**: Non supportés
- **Types de valeurs**: Strings, nombres, booleans, et null uniquement
- **Longueur maximale**: 255 caractères par nom d'événement, clé ou valeur

## Prochaines étapes possibles

Pour enrichir votre tracking, vous pourriez ajouter :

- **Navigation tracking**: Clics sur les liens de navigation (header/footer)
- **Scroll depth**: Profondeur de scroll sur les pages importantes
- **Application page views**: Si vous ajoutez des pages dédiées par application
- **404 tracking**: Pages non trouvées
- **Dark mode toggle**: Préférence de thème des utilisateurs
- **Mobile vs Desktop**: Type d'appareil (détection via user agent)

## Documentation officielle

- [Vercel Analytics Custom Events](https://vercel.com/docs/analytics/custom-events)
- [Limites et tarification](https://vercel.com/docs/analytics/limits-and-pricing)
