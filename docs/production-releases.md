# Publications de production

Depuis le 26 novembre 2026, la promotion automatique est désactivée sur les
17 projets de production de `guillaumes-projects-faaa7c9a`. Les cinq projets de
staging restent séparés. Une fusion GitHub ne suffit plus à remplacer le site
en service. Les propositions de dépendances, leurs tests et leur validation
dans Webbing restent manuels, par lot ; les versions majeures exigent toujours
la validation de Guillaume.

## Vérifier avant toute publication

1. Identifier le projet, le dépôt, la branche et la révision actuellement en
   service. Lancer `node scripts/releases/check-production.mjs` depuis ce dépôt
   pour vérifier les 17 projets en lecture seule. Un contrôle impossible ou une
   provenance inconnue bloque la publication. Ce contrôle ne publie rien et ne
   constitue pas une validation fonctionnelle.
2. Le code à publier doit être enregistré **et poussé sur GitHub**, puis intégré
   par PR. Ne jamais publier de production depuis un dossier de travail local,
   même si `git rev-parse HEAD` paraît correct : des fichiers non suivis ou
   modifiés peuvent avoir été embarqués par la CLI.
3. La révision candidate doit conserver l’historique de la version en service.
   Ne pas mélanger un retour arrière explicite avec une nouvelle publication.
   Vérifier les changements réellement inclus dans la PR et conserver l’ID de
   l’ancien déploiement pour un éventuel retour arrière.
4. Les contrôles doivent réussir sur le code final et une base à jour :
   installation avec lockfile figé, tests, typage, lint et build. Un test non
   lancé faute de budget n’est pas un test réussi. La majeure de Node doit
   correspondre à Vercel et le gestionnaire de paquets à `packageManager`.
5. Vérifier les parcours essentiels dans un environnement isolé, avec base et
   comptes de test : connexion admin, aperçu, publication, TV haut/bas,
   contact et réservation pour Pattùs. Les contrôles existants des neuf routes
   et les 33 tests admin/kiosk restent nécessaires mais ne couvrent pas à eux
   seuls tous ces parcours. Ne pas envoyer de vrais messages, paiements ou
   publications TV lors des tests.
6. Tester le déploiement candidat exact. Promouvoir une prévisualisation peut
   déclencher une reconstruction avec les variables de production : une
   prévisualisation réussie ne prouve pas que ce nouveau build est identique.
   Utiliser un build de production préparé sans attribution des domaines,
   contrôler son ID et ses tests avant toute promotion explicite.
7. Après toute promotion ou restauration, **réappliquer et relire**
   `autoAssignCustomDomains: false` via l’API Vercel. Une promotion peut
   réactiver ce réglage. Vérifier aussi le déploiement réellement servi par les
   domaines et effectuer les contrôles de lecture après publication.

## Protections et limites

Les branches principales des dépôts publics peuvent imposer une PR, des
contrôles réussis et une branche à jour, y compris pour les administrateurs.
Le contrôle automatique ignoré sur une PR Dependabot porte un autre nom que
`Webbing / Quality` ; il ne doit jamais servir de preuve que les tests manuels
ont réussi.

L’offre GitHub actuelle refuse les protections de branche des dépôts privés
(HTTP 403). Leur confidentialité et la facturation ne sont pas modifiées.
La promotion manuelle Vercel fournit un garde-fou indépendant, mais un
administrateur Vercel peut toujours publier directement ou modifier ce réglage.
Le risque zéro ne peut pas être garanti. Une base de prévisualisation isolée
et les parcours fonctionnels complets restent à vérifier projet par projet.

Les dossiers locaux contenant du travail en cours restent intacts. Leur contenu
ne doit pas être ajouté en bloc à GitHub pour « synchroniser » la production.

Sources : [promotions Vercel](https://vercel.com/docs/deployments/promoting-a-deployment),
[protections GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

La publication avec confirmation et code TOTP est disponible dans Webbing Gestion.
Voir [le fonctionnement et les limites](publication-webbing.md).
