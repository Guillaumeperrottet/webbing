# Lots de tests à la demande

Dans Gestion → Mises à jour, « Ton lot de la semaine » permet de choisir une
proposition par dépôt, avec trois dépôts au maximum. Ce titre ne programme
aucune tâche : le propriétaire choisit quand préparer puis confirmer son lot.
Les propositions peuvent contenir des correctifs, des versions mineures ou
majeures. Leur validation et leur publication restent des étapes distinctes.

La préparation lit les versions GitHub et affiche le nombre d’exécutions ainsi
que les dépôts privés concernés. Elle ne lance aucun workflow. La confirmation
est liée à la session ayant préparé le lot et expire après quinze minutes.
Les deux étapes exigent la double authentification côté serveur.

Avant le premier envoi, toutes les propositions sont revérifiées. Un changement
de version invalide la confirmation. Les demandes sont réservées en base avant
les appels GitHub ; une confirmation répétée retrouve le même lot. Une seule
confirmation de lot est active et trois dépôts au maximum sont en cours, y
compris les lancements individuels. Une réponse réseau perdue après l’envoi
reste à réconcilier ; elle ne justifie jamais une répétition automatique.

Les lancements des différents dépôts ne constituent pas une transaction chez
GitHub : un dépôt peut refuser sa demande après l’envoi d’une autre. Le suivi
conserve donc un résultat par dépôt. Aucun refus ne relance le lot entier.
Le quota inclus et les frais éventuels relèvent de GitHub : la limite de trois
dépôts borne le nombre de demandes, mais ne fixe pas un plafond monétaire.

Le suivi relit uniquement les dépôts actifs toutes les trente secondes lorsque
la page est visible. Cette lecture ne démarre ni tests ni fusion. Une exécution
ayant échoué sans aucune étape exécutée est affichée « Tests non démarrés » :
le quota, les permissions ou les runners sont à vérifier avant de conclure à
une erreur du code. Les tests réussis d’une ancienne version apparaissent
« À retester » si la proposition ou sa branche cible a changé.

Les nouvelles tables et colonnes sont définies dans
`scripts/gestion/migrations/002-dependency-batches.sql`, également repris dans
le schéma complet. La migration est additive et compatible avec l’ancienne
version de Gestion.

Validation : tests de politique et d’état, test des confirmations concurrentes
sur un schéma PostgreSQL temporaire, et parcours navigateur avec MFA et API
GitHub simulée. Les tests du navigateur ne lancent aucun workflow réel.
