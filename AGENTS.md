# Règles de publication

Lire `docs/production-releases.md` avant de modifier un pipeline de livraison ou
de publier une version. La promotion automatique est désactivée sur les projets
de production. Ne pas la réactiver lors d’une promotion.

Le code de production doit provenir d’une révision poussée sur GitHub et d’une
PR vérifiée. Ne pas publier depuis un dossier local contenant du travail non
commité ou non suivi. Préserver le travail local de Guillaume.

Les tests de dépendances et les fusions se font manuellement par lot depuis
Webbing. Ne pas réactiver les tests automatiques Dependabot, les relances
automatiques ou l’automerge. Les versions majeures restent à valider par
Guillaume dans Webbing. Ne pas modifier son budget ni la confidentialité des
dépôts pour contourner un blocage GitHub.
