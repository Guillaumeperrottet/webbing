export type ProjectCaseStudy = {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  facts: readonly { label: string; text: string }[];
  note?: string;
  credits?: string;
  proof: { label: string; href: string };
};

// Public facts are checked against the linked sources; project motivations come from Guillaume.
export const caseStudies: readonly ProjectCaseStudy[] = [
  {
    id: "etude-selfcamp",
    projectId: "selfcamp",
    title: "Des aires autonomes au service des régions.",
    summary: "Créer une aire et valoriser sa région",
    facts: [
      {
        label: "Le besoin",
        text: "Aider les communes et les régions à organiser l’accueil des camping-cars et à faire découvrir les villages et les commerces locaux.",
      },
      {
        label: "Notre rôle",
        text: "Nous avons développé l’application web : recherche sur une carte interactive, fiches d’aires, réservation et paiement en ligne.",
      },
      {
        label: "Une solution complète",
        text: "Selfcamp accompagne l’aménagement des aires : délimitation des places, signalétique, enregistrement par QR code et promotion, avec une solution de vidange sur place ou dans des campings partenaires.",
      },
    ],
    proof: { label: "Découvrir l’approche Selfcamp", href: "https://www.selfcamp.ch/about" },
    // Sources: https://www.selfcamp.ch/ (Webbing credit, search and online payments),
    // https://www.selfcamp.ch/about (positioning and services re-read 2026-11-02);
    // Selfcamp's on-site services are not attributed to Webbing's development role.
    // The documented UFT collaboration remains in the existing project summary.
  },
  {
    id: "etude-openwind",
    projectId: "openwind",
    title: "Choisir son spot sans multiplier les outils.",
    summary: "Pourquoi Openwind ?",
    facts: [
      {
        label: "Le besoin",
        text: "Préparer une sortie de kite ou de parapente sans passer d’un site météo à l’autre : connaître le vent mesuré, anticiper son évolution et comparer les spots.",
      },
      {
        label: "La réponse",
        text: "Réunir les balises, les prévisions, les webcams et un planificateur dans une même application, avec des critères adaptés au sport et des sources identifiées.",
      },
      {
        label: "Un projet ouvert",
        text: "Un projet open source construit en Suisse romande. Le code est accessible et la communauté peut signaler un problème, proposer un spot ou contribuer à l’outil.",
      },
    ],
    proof: { label: "Comprendre Openwind", href: "https://www.openwind.ch/fr/about" },
    // Re-read 2026-11-27: /fr/about (networks, planning, sports, open source)
    // and /fr (webcams, sources and the distinction between observations and forecasts).
  },
  {
    id: "etude-wisp",
    projectId: "wisp",
    title: "Partager ses fichiers en gardant le choix.",
    summary: "Pourquoi Wisp ?",
    facts: [
      {
        label: "L’idée de départ",
        text: "Réduire notre dépendance aux grandes plateformes américaines pour partager et organiser nos fichiers. Proposer une alternative indépendante que nous développons et faisons évoluer.",
      },
      {
        label: "La réponse",
        text: "Envoyer des fichiers par lien, sans compte pour un transfert ponctuel, ou les conserver dans une bibliothèque privée, avec des dossiers et des tags pour les retrouver.",
      },
      {
        label: "Le choix du stockage",
        text: "Les fichiers sont stockés en Suisse. Les liens temporaires servent aux envois ponctuels ; la bibliothèque permet de garder et d’organiser les documents utiles au quotidien.",
      },
    ],
    proof: { label: "Découvrir Wisp", href: "https://wisp.ch/" },
    // Motivation supplied by Guillaume on 2026-11-27. Public features re-read on /
    // and /legal/privacy: Swiss storage applies to files; account data is hosted in Europe.
    // Do not imply the entire infrastructure is Swiss or free of American providers.
  },
  {
    id: "etude-mypapers",
    projectId: "mypapers",
    title: "Retrouver le fil du travail quotidien.",
    summary: "Pourquoi Mypapers ?",
    facts: [
      {
        label: "Le besoin",
        text: "Ne plus disperser les notes, les tâches et les documents entre plusieurs outils. Retrouver le contexte d’un projet ou d’un lieu, et savoir ce qu’il reste à faire.",
      },
      {
        label: "La réponse",
        text: "Réunir notes, projets, tâches, agenda et documents dans un même espace. Pour les établissements, les plans interactifs relient les équipements à leur suivi. Le même compte permet de travailler sur le web et sur iPhone.",
      },
      {
        label: "La démarche",
        text: "Construire un outil indépendant, adapté à notre manière de travailler, et réduire notre dépendance aux grandes plateformes. Une application que nous pouvons faire évoluer au fil des usages.",
      },
    ],
    proof: { label: "Découvrir Mypapers", href: "https://www.mypapers.ch/" },
    // Motivation follows Guillaume's request on 2026-11-27. Features checked on the
    // demonstration account's home/plan and /assistance (teams, files, tasks and calendars).
    // No unsupported claim about Mypapers' hosting location or its providers.
  },
  {
    id: "etude-pattus-hotel",
    projectId: "pattus-hotel",
    title: "Un lieu pour séjourner, travailler et se retrouver.",
    summary: "Faire découvrir toutes les facettes du lieu",
    facts: [
      {
        label: "Le besoin",
        text: "Faire découvrir un lieu de vie qui réunit chambres, restaurant, bar, séminaires et événements, au bord du lac de Neuchâtel à Saint-Aubin-Sauges.",
      },
      {
        label: "Notre rôle",
        text: "Nous avons développé le site multilingue, à partir de la conception de Pierre & Théo.",
      },
      {
        label: "Le parcours disponible",
        text: "Les visiteurs explorent les chambres, la table et les espaces de séminaires. Les réservations de séjour passent par Mews et celles du restaurant par Zenchef.",
      },
    ],
    credits: "Conception : Pierre & Théo. Développement : Webbing.",
    proof: { label: "Découvrir les chambres de Pattùs", href: "https://www.pattushotel.ch/fr/chambres" },
    // Positioning re-read 2026-11-02 on /fr, /fr/restaurant-bar (Zenchef)
    // and /fr/seminaires-evenements. Preserve Pierre & Théo's conception credit.
    // Sources: https://www.pattushotel.ch/fr (address, sections, Mews links and
    // explicit conception/development credits), /fr/chambres and
    // /fr/seminaires-evenements. Multilingual scope is documented in portfolio.ts.
  },
];
