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

// Facts checked on 2026-10-29 against the existing portfolio and the public sites.
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
    note: "Le film présente le parcours de réservation Selfcamp. Les informations de séjour et de paiement sont des données de démonstration.",
    proof: { label: "Découvrir l’approche Selfcamp", href: "https://www.selfcamp.ch/about" },
    // Sources: https://www.selfcamp.ch/ (Webbing credit, search and online payments),
    // https://www.selfcamp.ch/about (positioning and services re-read 2026-11-02);
    // Selfcamp's on-site services are not attributed to Webbing's development role.
    // The supplied guest-journey film uses fictional demonstration data.
    // The documented UFT collaboration remains in the existing project summary.
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
