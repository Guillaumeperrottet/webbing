# Règles de publication

Lire `docs/production-releases.md` avant de modifier un pipeline de livraison ou
de publier une version. La promotion automatique est désactivée sur les projets
de production. Ne pas la réactiver lors d’une promotion.

À la demande de Guillaume, ses pushes personnels sur la branche de production
peuvent être publiés sans passer par Webbing, après réussite des contrôles et du
build. L’exception est attestée par un webhook GitHub signé et l’identité du
compte déclencheur ; elle ne repose jamais sur le nom d’auteur du commit seul.
Les propositions de dépendances restent manuelles. Voir
`docs/publications-personnelles.md`. Le code doit être poussé sur GitHub ; les
publications manuelles Webbing conservent leur exigence de PR vérifiée.
Ne pas publier depuis un dossier local contenant du travail non
commité ou non suivi. Préserver le travail local de Guillaume.

Les tests de dépendances et les fusions se font manuellement par lot depuis
Webbing. Ne pas réactiver les tests automatiques Dependabot, les relances
automatiques ou l’automerge. Les versions majeures restent à valider par
Guillaume dans Webbing. Ne pas modifier son budget ni la confidentialité des
dépôts pour contourner un blocage GitHub.
