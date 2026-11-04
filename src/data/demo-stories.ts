// Visible captions aligned with official public positioning on 2026-11-02.
// Keep the original media descriptions and their capture provenance below.
export const demoStories = {
  wisp: {
    duration: 24000,
    caption: "Partager ses fichiers et les retrouver dans sa bibliothèque.",
    description: "Une démonstration Wisp avec Presentation.pdf, Paysage.jpg et Camping.webp. Un curseur montre les clics sur Créer le lien, Copier le lien et le dossier Projet camping. Le destinataire retrouve les mêmes fichiers. Dans la bibliothèque, Photos est saisi lettre par lettre et filtre les deux images. Le lien wisp.test est un exemple de démonstration.",
  },
  plannikeeper: {
    duration: 11000,
    caption: "Les tâches et les échanges, liés au bon établissement.",
    description: "Deux captures de la démonstration publique PlanniKeeper montrent le passage de Moi à Équipe. Les tâches sont les exemples publiés par le produit. Aucune intervention n’est cochée ni modifiée.",
  },
  "pattus-hotel": {
    duration: 13000,
    caption: "Un lieu de vie au bord du lac de Neuchâtel.",
    description: "De légères rides d’eau animent le lac de l’accueil Pattùs, puis la vraie photographie de la Suite vue lac dévoile son salon, sa baie vitrée et sa vue sur le port. Aucun rideau artificiel ni réservation n’est simulé.",
  },
  "alpha-hotel": {
    duration: 12000,
    caption: "Des chambres pour un séjour au cœur de Fribourg.",
    description: "Les vraies photographies des chambres simple et double d’Alpha Hotel restent côte à côte. L’attention passe de la chambre simple, présentée pour une personne et de 16 m², à la chambre double, décrite pour une à deux personnes et de 22 m². Les informations reprennent les pages publiques, sans disponibilité ni réservation simulée.",
  },
  coachingbymarie: {
    duration: 11000,
    caption: "Cours collectifs et coaching autour de Bulle.",
    description: "Deux chaussures illustrent une cadence de course sur l’accueil de Marie. La vraie colonne du mardi paraît ensuite et met successivement en évidence Run Training et Training Outdoor, les deux cours publiés. Les horaires restent ceux de la capture, sans inscription simulée.",
  },
  graphomouv: {
    duration: 30000,
    caption: "Voir le geste qui donne naissance à la lettre.",
    description: "La vidéo originale fournie par Graphomouv montre le tracé du A majuscule. Elle occupe seule le carnet, sans fiche ni tampon superposés. Le mouvement réduit affiche son image fixe.",
  },
  dipiaza: {
    duration: 10500,
    caption: "Une enseigne de cafés et sandwicheries, une adresse à Bulle.",
    description: "Une tasse illustrée se remplit et laisse monter de la vapeur. La véritable fiche Dipiaza Bulle apparaît à côté, avec les informations pratiques capturées sur le site. Aucune commande n’est simulée.",
  },
} as const;

export type StoryDemoId = keyof typeof demoStories;
export type PortfolioDemoId = StoryDemoId | "openwind";

// Primary sources checked on 2026-10-30; use real captures and photographs, never fabricated app screens.
// Wisp: https://wisp.ch/ — public transfer, file storage and sharing in Switzerland.
// PlanniKeeper: https://www.plannikeeper.ch/ — public demo, Moi / Équipe states.
// /projects/usage/planni-{personal,team}.jpg: the actual public demonstration window.
// Pattùs: https://www.pattushotel.ch/fr/chambres — Standard room photograph.
// /projects/usage/pattus-standard-photo.jpg: screenshot of that photograph element.
// /projects/usage/pattus-suite-lake-original.jpg: original public Suite vue lac photo,
// observed after selecting that category on /fr/chambres (2026-10-30).
// /projects/usage/pattus-home-current.jpg: actual /fr homepage, 1440×900 capture
// on 2026-10-30, replacing the supplied capture's obsolete gallery coming-soon label.
// Alpha: https://www.alpha-hotel.ch/hotel — Simple, Double and Suite Omega categories.
// /projects/usage/alpha-{simple,double,suite}-original.jpg: original photographs fetched
// from the image URLs observed in each actual room gallery, without its overlaid controls.
// Alpha comparison facts: /hotel (Simple: 1 person, 16 m²), /hotel?room=double
// (Double: ideal for 1–2 people, 22 m²; the site also mentions a possible third person).
// Coaching: https://www.coachingbymarie.ch/#planning — screenshot of the Tuesday column.
// /projects/usage/coaching-tuesday.png: captured timetable, not live availability.
// Dipiaza: https://www.dipiaza.ch/#locations — actual Bulle location card (2026-10-29).
// Graphomouv: original supplied 30-second video, not the password-protected product.
