type Screenshot = { src: string; width: number; height: number; alt: string; label?: string; framing?: "plan"; mobile?: { src: string; width: number; height: number } };
export type Presentation = { description: string; features: readonly [string, string, string]; screenshot: Screenshot; secondaryScreenshot?: Screenshot };

// Screenshots show the public homepage or a representative application screen.
// Graphomouv's public access is protected; retain its supplied teaching example.
export const projectPresentations = {
  selfcamp: {
    description: "Une solution complète pour créer des aires de camping-car qui bénéficient aux communes, aux régions et aux vanlifers.",
    features: ["Carte des aires", "Réservation en ligne", "Paiement en ligne"],
    screenshot: { src: "/selfcamp_accueil.png", width: 3004, height: 1922, alt: "Page d’accueil de Selfcamp avec la recherche d’aires de camping-car", mobile: { src: "/projects/static/selfcamp-mobile.jpg", width: 375, height: 812 } },
    secondaryScreenshot: { label: "Carte des aires", src: "/projects/selfcamp-map.jpg", width: 1440, height: 900, alt: "Selfcamp : la carte des aires et leurs emplacements", mobile: { src: "/projects/static/selfcamp-map-mobile.jpg", width: 390, height: 844 } },
  },
  openwind: {
    description: "Une application pour consulter le vent, les prévisions et les webcams d’un spot.",
    features: ["Balises en direct", "Prévisions météo", "Webcams"],
    screenshot: { src: "/projects/openwind/home-desktop.jpg", width: 1425, height: 891, alt: "Page d’accueil d’Openwind pour trouver un spot et consulter le vent en Suisse", mobile: { src: "/projects/openwind/home-mobile.jpg", width: 375, height: 812 } },
    secondaryScreenshot: { label: "Mesures du vent", src: "/projects/openwind/observations-desktop.jpg", width: 937, height: 811, alt: "Openwind : mesures du vent et graphique des conditions à Morlon", mobile: { src: "/projects/openwind/observations-mobile.jpg", width: 343, height: 391 } },
  },
  wisp: {
    description: "Une application de partage et de gestion de fichiers, hébergée en Suisse.",
    features: ["Partage par lien", "Dossiers et tags", "Bibliothèque privée"],
    screenshot: { src: "/projects/wisp/home-desktop.jpg", width: 1800, height: 1036, alt: "Page d’accueil de Wisp avec l’envoi de fichiers par lien", mobile: { src: "/projects/wisp/home-mobile.jpg", width: 380, height: 822 } },
    secondaryScreenshot: { label: "Bibliothèque", src: "/projects/wisp/library-anonymized-desktop.jpg", width: 1647, height: 955, alt: "Wisp : bibliothèque privée et classement par dossiers, avec des noms fictifs", mobile: { src: "/projects/wisp/library-anonymized-mobile.jpg", width: 853, height: 1844 } },
  },
  mypapers: {
    description: "Un outil pour réunir les notes, les tâches et le suivi des équipements d’une équipe.",
    features: ["Notes et projets", "Tâches et agenda", "Plans interactifs"],
    screenshot: { src: "/projects/mypapers/home-desktop.jpg", width: 1440, height: 900, alt: "Mypapers : l’accueil du compte de démonstration avec les projets et les tâches", mobile: { src: "/projects/mypapers/home-mobile.jpg", width: 390, height: 844 } },
    secondaryScreenshot: { label: "Plan interactif", framing: "plan", src: "/projects/mypapers/plan-real-anonymized.jpg", width: 1463, height: 1075, alt: "Mypapers : plan du Camping du Lac et suivi d’un équipement, avec un code fictif" },
  },
  "pattus-hotel": {
    description: "Un site multilingue pour découvrir l’hôtel, le restaurant et les espaces de séminaires au bord du lac.",
    features: ["Site multilingue", "Chambres et restaurant", "Réservation en ligne"],
    screenshot: { src: "/projects/usage/pattus-home-current.jpg", width: 1440, height: 900, alt: "Page d’accueil de Pattùs Hotel au bord du lac de Neuchâtel", mobile: { src: "/projects/static/pattus-mobile.jpg", width: 375, height: 812 } },
  },
  "alpha-hotel": {
    description: "Un site pour présenter les chambres, les studios et les espaces de travail d’Alpha Hotel, à Fribourg.",
    features: ["Chambres et studios", "Coworking et réunions", "Réservation en ligne"],
    screenshot: { src: "/projects/static/alpha-desktop.jpg", width: 1425, height: 891, alt: "Page d’accueil d’Alpha Hotel à Fribourg", mobile: { src: "/projects/static/alpha-mobile.jpg", width: 375, height: 812 } },
  },
  coachingbymarie: {
    description: "Un site pour découvrir les cours de Marie, consulter le planning et prendre contact.",
    features: ["Présentation des cours", "Planning", "Contact"],
    screenshot: { src: "/projects/static/coaching-desktop.jpg", width: 1425, height: 891, alt: "Page d’accueil de Coaching by Marie et ses entraînements autour de Bulle", mobile: { src: "/projects/static/coaching-mobile.jpg", width: 375, height: 812 } },
  },
  graphomouv: {
    description: "Un site pédagogique pour découvrir le tracé des lettres et des chiffres.",
    features: ["Tracés animés", "Navigation tactile", "Exercices sur tablette"],
    screenshot: { src: "/projects/graphomouv-a.jpg", width: 1360, height: 1920, alt: "Exemple pédagogique Graphomouv : le tracé de la lettre A" },
  },
  dipiaza: {
    description: "Un site pour découvrir l’enseigne, sa carte et les informations pratiques de ses cafés.",
    features: ["Carte et produits", "Adresses et horaires", "Présentation de l’enseigne"],
    screenshot: { src: "/projects/static/dipiaza-home-current-desktop.jpg", width: 1425, height: 891, alt: "Page d’accueil de Dipiaza avec deux espressos et la présentation des cafés", mobile: { src: "/projects/static/dipiaza-home-current-mobile.jpg", width: 360, height: 780 } },
  },
} satisfies Record<string, Presentation>;

export type PresentedProjectId = keyof typeof projectPresentations;
