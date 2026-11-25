# Gestion privée Webbing

L’espace `/gestion` appartient au même projet Vercel que le site vitrine. Les routes publiques sont dans `src/app/(public)` ; elles gardent leur adresse. Le suivi publicitaire du site n’est pas chargé dans l’espace privé.

## Accès

Better Auth 1.7 gère les mots de passe, les cookies de session, les codes TOTP et les codes de secours. Le compte est limité à `WEBBING_OPS_ADMIN_EMAIL`. Une invitation privée, valable 24 heures et à usage unique, permet de choisir son mot de passe. La création publique de comptes est fermée.

L’inscription du second facteur exige un code TOTP valide. Chaque nouvelle session doit disposer d’une preuve serveur enregistrée dans `ops_verified_sessions`. Une session créée avant l’activation du second facteur ne gagne pas d’accès lorsque celui-ci est activé ailleurs. Aucun mécanisme de confiance du navigateur ne dispense du second facteur. La durée maximale de session est de huit heures. La récupération en cas de perte du téléphone utilise les codes de secours ; aucune récupération par e-mail ne contourne le second facteur.

Chaque page privée, Server Action et téléchargement vérifie les droits côté serveur. Le compte PostgreSQL n’a aucun droit d’administration sur les autres bases ; il est propriétaire de la base dédiée `webbing_ops`. La connexion utilise TLS avec vérification du certificat et du nom d’hôte. Les secrets restent dans les variables serveur Vercel et les fichiers locaux ignorés par Git.

## Données et fraîcheur

- `pnpm gestion:migrate` vérifie le schéma Better Auth et crée les tables de gestion. La migration initiale générée est conservée dans `scripts/gestion/migrations`.
- `pnpm gestion:import` importe l’inventaire du compte Vercel connecté au CLI et les versions déclarées dans les dépôts locaux. Il ne copie ni variables d’environnement ni contenu des bases.
- `/api/gestion/cron`, déclaré dans `vercel.json`, vérifie les adresses HTTPS et les projets Supabase raccordés toutes les quinze minutes. `CRON_SECRET` protège cet appel Vercel. Les redirections des contrôles HTTP ne sont suivies que sur le même domaine, avec ou sans `www`. Les accès protégés sont distingués des erreurs.
- La disponibilité HTTP ne confirme pas la santé des paiements, de la base ou des tâches applicatives. Un résultat de plus de 45 minutes est signalé ancien.
- Les versions, automatismes et tâches affichés viennent de l’inventaire du code ; ils ne constituent pas une analyse de vulnérabilités ou un historique d’exécution.
- Vercel envoie les événements de déploiement et de projet à `/api/gestion/vercel`. La signature HMAC du corps brut, l’équipe, la date et l’identifiant unique sont contrôlés. Les événements anciens ne remplacent pas un état plus récent. Une réussite de construction ne signifie pas une promotion : la version en service est conservée séparément. Une demande de retour arrière attend sa confirmation.
- La page Connexions accepte des jetons Supabase limités aux projets choisis et à « Project Settings Read ». Les seules requêtes sont les GET de métadonnées et de santé des services ; aucun accès aux lignes ou aux clés API n’est requis. Plusieurs comptes sont possibles. Les identifiants sont chiffrés avec AES-256-GCM et un contexte propre à chaque connexion. Déconnecter efface le secret local ; sa révocation chez Supabase reste possible depuis le compte fournisseur.
- Un même jeton renvoyé plusieurs fois met sa connexion à jour, y compris lors de soumissions simultanées. Les sélections de projets sont réunies, et chaque projet n’est interrogé qu’avec la connexion à laquelle il est actuellement rattaché. Les refus d’accès nomment les projets manquants ; un jeton expiré ou révoqué est distingué d’un jeton sans permission sur un projet. Les projets non raccordés sont précochés dans le formulaire.
- Les requêtes de santé utilisent le délai par défaut de l’API, avec un délai maximal de huit secondes côté Webbing. Le paramètre facultatif `timeout_ms` est omis : l’API le rejette actuellement comme chaîne de caractères dans la query string.
- Les états Supabase importés sans connexion active sont explicitement indiqués « Synchronisation à activer ». La vue Maintenance reste issue de l’inventaire du code. Le site ne réutilise pas les connexions de l’assistant.
- Les contrôles HTTP sont conservés 30 jours ; le journal est conservé 90 jours.

## Synology

La page Connexions prépare un script à placer dans une tâche planifiée sous le compte propriétaire des sauvegardes. Le script Python utilise seulement la bibliothèque standard. Il installe ses fichiers avec des permissions privées et envoie des rapports en HTTPS. Sa clé autorise uniquement l’envoi de rapports ; elle ne permet ni lecture des données privées ni connexion au tableau de bord. Seule son empreinte SHA-256 est conservée en base. La révocation est immédiate.

Les sources connues sont enregistrées en base dans `ops_nas_sources`. Les rapports `last-success.json` sont comparés à l’archive présente : projet attendu, état, taille et emplacement. Les archives chiffrées restent sur le NAS. Le programme ne déchiffre ni ne restaure aucune base. Un rapport datant de plus d’une heure est signalé manquant ; l’ancienneté maximale de sauvegarde est propre à chaque source.

Le déploiement initial raccorde les sauvegardes Mypapers (nom historique PlanniKeeper) et SelfKey (source historique Selfcamp Exoscale). Il ne modifie pas leurs tâches de sauvegarde ni leur rétention. D’autres sources nécessitent l’ajout de leur configuration et, lorsqu’elles n’existent pas encore, une mise en place distincte de la sauvegarde.

## Vérifications

`pnpm build`, `pnpm test:security`, les tests du collecteur et `pnpm audit --prod` sont les contrôles ordinaires. Dependabot propose les mises à jour hebdomadaires ; le workflow GitHub vérifie le build et les tests sans accéder à la base de gestion.

Le test complet d’authentification utilise exclusivement le serveur local `http://localhost:3108`, lancé avec `WEBBING_OPS_ADMIN_EMAIL=webbing-security-qa@webbing.invalid` et `WEBBING_OPS_URL=http://localhost:3108`. Avec ce serveur actif, `pnpm test:gestion` vérifie invitation unique, refus des origines externes, inscription publique fermée, mot de passe seul refusé, code invalide refusé, TOTP accepté, ancienne session non élevée, code de secours et déconnexion. Les enregistrements du compte de test sont supprimés en fin de test ; ne pas utiliser `WEBBING_OPS_QA_KEEP` hors d’une vérification visuelle temporaire.

`pnpm gestion:invite` envoie l’invitation au seul compte administrateur configuré. Il refuse de recréer un compte déjà activé. Les fichiers `.env.local`, `.vercel` et les configurations privées Synology ne doivent jamais être publiés dans Git.

L’amorçage des fournisseurs utilise `node --conditions=react-server --import tsx scripts/gestion/seed-providers.ts`, puis `scripts/gestion/register-vercel.ts` une fois le point de réception publié. Le premier ne copie que des métadonnées et le second conserve uniquement le secret de signature chiffré. Le jeton du CLI Vercel reste sur le Mac. Le test des événements contre la base nécessite explicitement `WEBBING_OPS_DB_TEST=1` et ne manipule que des fixtures temporaires.


## Mises à jour des dépendances

Les 16 dépôts disposent d’une proposition d’installation de Dependabot et des contrôles communs. Les configurations couvrent aussi le portail Campus Gérance et le serveur WebDAV Wisp. Dependabot propose les mises à jour npm et GitHub Actions chaque semaine ; les correctifs de sécurité peuvent être proposés entre ces passages.

Le contrôle Qualité installe les versions verrouillées, exécute les suites existantes, construit l’application, vérifie les types et les règles de code configurées, puis démarre le serveur et teste ses réponses. Les bases éventuelles sont des PostgreSQL jetables du runner. Aucun secret ou accès de production n’est fourni au code des propositions. Les contrôles existants sont conservés. Une application sans suite métier dispose d’une vérification de compilation et de démarrage, qui ne remplace pas des scénarios utilisateurs.

La fusion automatique est activée dépôt par dépôt avec la variable `WEBBING_DEPENDENCY_AUTOMERGE=true`, après une première exécution réussie. Le workflow de décision utilise uniquement une action commune figée à un commit, sans récupérer ni exécuter le code de la proposition. Il exige une proposition Dependabot du même dépôt, ses métadonnées de commit signées, des fichiers de dépendances uniquement, un contrôle Qualité réussi et tous les autres contrôles terminés sans échec. Une attestation séparée lie le résultat au commit de la branche cible réellement testé. Les correctifs et versions mineures seuls peuvent être fusionnés ; les versions majeures, groupes contenant une version majeure et modifications des workflows de contrôle restent manuels. Une modification de la proposition ou de la branche cible impose de nouveaux contrôles. Les dépôts privés de ce compte n’offrent pas les protections de branche natives avec le forfait actuel ; ce verrou de fusion est appliqué par le workflow.

Dans Connexions, créer un jeton GitHub à permissions limitées, pour les 16 dépôts sélectionnés : Contents, Pull requests et Commit statuses en lecture ; Actions en lecture et écriture. Aucun droit d’administration, de facturation ou d’écriture des workflows n’est requis. Le lien de création préremplit les permissions, mais la sélection des dépôts et la validation restent dans GitHub. Le jeton est saisi directement dans Webbing, chiffré avec son propre contexte AES-GCM et peut être retiré ici. Le jeton OAuth du CLI sur le Mac n’est jamais copié vers l’application.

Le bouton Actualiser de la vue Mises à jour et le cron synchronisent les propositions et contrôles via les points de lecture REST de GitHub. Une validation exige la session administrateur avec son second facteur et une confirmation liée aux commits affichés. GitHub ne permet pas aux jetons à permissions limitées de lire l’API Checks. Le workflow de décision publie donc un statut de validation lié à la base testée. Le serveur vérifie ce statut et les deux commits, puis transmet une demande identifiée au workflow GitHub. Celui-ci relit tous les contrôles avec son propre GITHUB_TOKEN et fusionne uniquement les commits confirmés. Un contrôle en attente, un échec ou une base modifiée bloque l’opération. La demande, son état et le SHA finalement fusionné sont synchronisés et journalisés. Le jeton de Webbing ne fusionne pas directement les propositions. Les fusions automatiques restent gérées par GitHub même si sa connexion à Webbing est retirée.
