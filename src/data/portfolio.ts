export const applications = [
  {
    id: "openwind", name: "OpenWind", url: "https://www.openwind.ch/", category: "Vent et sports de plein air",
    benefit: "Comparer le vent et choisir son spot.",
    description: "OpenWind réunit les mesures de balises, les prévisions et les webcams pour préparer une sortie de kite ou de parapente. Son planificateur compare les spots selon les dates et le sport, au sein d’un projet communautaire et open source.",
    // Positioning: https://www.openwind.ch/fr and /en/about, read 2026-11-02.
    image: "/openwind_planif_accueil.png", width: 3334, height: 1934,
  },
  {
    id: "wisp", name: "Wisp", url: "https://wisp.ch/", category: "Bibliothèque et transfert de fichiers",
    benefit: "Organiser ses fichiers et les partager simplement.",
    description: "Wisp réunit une bibliothèque organisée par dossiers et tags et le transfert de fichiers par lien, avec hébergement en Suisse. Les offres collaboratives ajoutent des espaces d’équipe et l’édition de documents Office avec Collabora.",
    // Positioning: https://wisp.ch/ and /pricing, read in an isolated browser 2026-11-02.
    image: "/wisp_application.png", width: 3438, height: 1926,
  },
  {
    id: "plannikeeper", name: "PlanniKeeper", url: "https://www.plannikeeper.ch/", category: "Organisation des établissements",
    benefit: "Réunir les tâches, les échanges et l’équipe.",
    description: "Pour les hôtels, campings, résidences et gérances, PlanniKeeper rassemble les tâches, les discussions, les photos et les documents par établissement. Chacun retrouve son travail et les informations utiles, au bureau comme sur le terrain.",
    // Positioning: https://www.plannikeeper.ch/, public homepage read 2026-11-02.
    image: "/plannikeeper_application.png", width: 3450, height: 1918,
  },
] as const;

export const websites = [
  {
    id: "alpha-hotel", name: "Alpha Hotel", url: "https://www.alpha-hotel.ch/", category: "Hôtellerie", year: "2026",
    benefit: "Séjourner et travailler au cœur de Fribourg.",
    description: "Au cœur de Fribourg, Alpha Hotel réunit chambres, studios pour les longs séjours, coworking et espaces de réunion. Son site présente cette offre urbaine et accompagne aussi bien les séjours de passage que les besoins professionnels.",
    // Positioning: https://www.alpha-hotel.ch/en, read 2026-11-02.
    image: "/projects/alpha_project.png",
  },
  {
    id: "coachingbymarie", name: "Coachingbymarie", url: "https://www.coachingbymarie.ch/", category: "Coaching sportif", year: "2026",
    benefit: "Bouger avec un accompagnement adapté à ses objectifs.",
    description: "Coaching by Marie propose des cours collectifs en intérieur et en plein air, du coaching privé et des séances en entreprise autour de Bulle. Le site permet de découvrir les entraînements, de consulter le planning et de contacter la coach.",
    // Positioning: https://www.coachingbymarie.ch/, services read 2026-11-02.
    image: "/projects/coaching_projet.png",
  },
  {
    id: "graphomouv", name: "Graphomouv", url: "https://graphomouv.app/", category: "Apprentissage de l’écriture", year: "2026",
    benefit: "Voir le geste pour apprendre le tracé.",
    description: "Des animations montrent le tracé des lettres et des chiffres dans un site pédagogique interactif. Les exercices se parcourent aussi sur tablette, avec une navigation tactile.",
    // Public site checked 2026-11-02: /acces is password protected.
    // Retain only the previously supplied facts and original video; no inferred offer.
    image: "/projects/graphomouv-a.jpg",
  },
  {
    id: "dipiaza", name: "Dipiaza", url: "https://www.dipiaza.ch/", category: "Cafés et sandwicheries", year: "2024",
    benefit: "Trouver son café et sa pause gourmande.",
    description: "Dipiaza réunit des cafés et sandwicheries en Suisse romande, avec une histoire commencée en gare de Bulle. Le site présente l’enseigne, sa carte et ses différentes adresses pour retrouver les informations pratiques de chaque établissement.",
    // Positioning: https://www.dipiaza.ch/, history and locations read 2026-11-02.
    image: "/projects/dipiaza_projet.png",
  },
] as const;

export const showcaseProjects = [
  {
    id: "selfcamp", name: "SelfCamp", url: "https://www.selfcamp.ch/", category: "Aires de camping-car", application: true, year: "2025",
    benefit: "Créer des aires de camping-car autonomes.",
    description: "SelfCamp accompagne les communes et les régions dans la création d’aires de camping-car, de leur aménagement à leur promotion. Une solution pour organiser l’accueil des vanlifers, gérer l’enregistrement et les taxes de séjour, et valoriser les commerces locaux.",
    features: ["Aires autonomes", "Enregistrement QR", "Taxes de séjour"],
    // Positioning: https://www.selfcamp.ch/about, read on 2026-11-02.
    screens: [
      { label: "Carte des aires", src: "/projects/selfcamp-map.jpg", alt: "La carte SelfCamp et ses aires de camping-car en Suisse", width: 1440, height: 900 },
      { label: "Accueil", src: "/selfcamp_accueil.png", alt: "SelfCamp, recherche d’une aire de camping-car", width: 3004, height: 1922 },
    ],
  },
  ...applications.map((app) => ({
    ...app,
    application: true,
    features: app.id === "openwind" ? ["Balises en direct", "Prévisions météo", "Planification"] : app.id === "wisp" ? ["Bibliothèque de fichiers", "Transfert par lien", "Hébergement suisse"] : ["Tâches en équipe", "Échanges par tâche", "Plans et documents"],
    screens: app.id === "openwind" ? [
      { label: "Planification", src: "/openwind_planif_accueil.png", alt: "OpenWind, carte des spots et planification d’une session", width: 3334, height: 1934 },
      { label: "Prévisions", src: "/openwind_accueil.png", alt: "OpenWind, prévisions de vent", width: 1400, height: 900 },
    ] : [{ label: `Interface de ${app.name}`, src: app.image, alt: `Interface de ${app.name}`, width: app.width, height: app.height }],
  })),
  {
    id: "pattus-hotel", name: "Pattùs Hotel", url: "https://www.pattushotel.ch/fr", category: "Hôtel & restaurant", application: false, year: "2026",
    benefit: "Séjourner, travailler et se retrouver au bord du lac.",
    description: "À Saint-Aubin-Sauges, Pattùs réunit hôtel, restaurant, bar et espaces de séminaires au bord du lac de Neuchâtel. Le site multilingue présente les différentes façons de vivre le lieu et donne accès aux réservations de séjour et de table.",
    features: ["Hôtel et restaurant", "Séminaires et événements", "Réservation en ligne"],
    // Positioning: /fr, /fr/restaurant-bar and /fr/seminaires-evenements, read 2026-11-02.
    screens: [{ label: "Site de Pattùs Hotel", src: "/projects/usage/pattus-home-current.jpg", alt: "Le site de Pattùs Hotel, au bord du lac de Neuchâtel", width: 1440, height: 900 }],
  },
  ...websites.map((project) => ({
    ...project,
    application: false,
    features: project.id === "alpha-hotel" ? ["Séjours et studios", "Coworking et réunions", "Réservation en ligne"] : project.id === "coachingbymarie" ? ["Cours collectifs", "Coaching personnalisé", "Sport en entreprise"] : project.id === "graphomouv" ? ["Animation vidéo", "Tracé guidé", "Site interactif"] : ["Cafés et sandwicheries", "Carte et produits", "Adresses et horaires"],
    screens: project.id === "graphomouv" ? [{ label: "Animation du A majuscule", src: project.image, videoSrc: "/projects/graphomouv-a.mp4", alt: "Une animation Graphomouv montre le tracé du A majuscule sur un arbre", width: 1360, height: 1920 }] : [{ label: `Site de ${project.name}`, src: project.image, alt: `Le site de ${project.name}`, width: 1400, height: 900 }],
  })),
] as const;
