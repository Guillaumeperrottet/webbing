export const navigationGroups = [
  { label: "Supervision", items: [["ensemble", "Vue d’ensemble"], ["applications", "Applications"], ["bases", "Bases de données"], ["sauvegardes", "Sauvegardes"]] },
  { label: "Maintenance", items: [["dependances", "Mises à jour"], ["deploiements", "Déploiements"], ["maintenance", "Inventaire technique"]] },
  { label: "Administration", items: [["connexions", "Connexions"], ["securite", "Sécurité"], ["journal", "Journal"]] },
] as const;
