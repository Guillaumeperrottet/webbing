# Publications après un push personnel

Guillaume a demandé le 27 novembre 2026 que ses modifications arrivent en
production après les contrôles, sans confirmation ni code 2FA supplémentaire
dans Webbing. Cette exception remplace l’exigence de validation Webbing pour
les seuls pushes personnels admissibles. Les dépendances restent manuelles.

Un webhook GitHub par dépôt reçoit `push` et `workflow_run`. Le corps brut est
signé en HMAC-SHA256 avec un secret propre au dépôt, conservé chiffré dans
Webbing. L’identifiant numérique du compte Guillaumeperrottet et celui du dépôt
sont fixés au provisionnement. Un push forcé, une suppression de branche, un
autre compte ou une branche différente de la production ne sont pas admissibles.
Le simple auteur Git ou l’identité qui clique sur une fusion ne suffisent pas.

Webbing attend un build Vercel de production prêt, la révision actuelle de la
branche et un contrôle `Webbing / Quality` réellement exécuté avec succès. Le
run GitHub doit provenir du même push personnel et être postérieur à
l’activation de la règle. Les versions déjà en attente ne sont pas publiées
lors de l’installation. Une PR n’est pas exigée pour ce circuit personnel.

Tout l’historique entre la production servie et la version candidate est relu :
auteurs résolus par GitHub, PR associées à chaque commit et propositions de
dépendances connues. Une proposition Dependabot reste manuelle même si Guillaume
effectue sa fusion. Un mélange avec des dépendances en attente, un autre auteur,
un historique incomplet ou plus de 50 commits impose une publication manuelle.
Les historiques divergents et les données non vérifiables bloquent l’opération.

Les événements GitHub et Vercel réveillent le traitement ; le contrôle périodique
existant reprend les demandes en attente si un événement manque. Aucun workflow
supplémentaire de tests n’est lancé. Les traitements réutilisent les contrôles
normaux du dépôt, sans relancer les dépendances ni modifier les budgets.

Chaque push et projet ne peuvent réserver qu’une seule publication. Les
publications personnelles et manuelles partagent le même verrou par projet.
Une promotion dont la réponse est incertaine n’est jamais renvoyée
automatiquement. Le build exact est promu, ses domaines sont relus, et
`autoAssignCustomDomains: false` est réappliqué après chaque promotion. Ce
réglage Vercel reste désactivé pour éviter de publier aussi les automatismes.

Le suivi apparaît dans Déploiements et le journal ; Connexions indique les
règles actives et les derniers blocages. L’accès à Gestion conserve sa 2FA, et
les publications manuelles Webbing gardent leur confirmation avec code récent.
Pattùs peut utiliser l’exception personnelle avec son accès de publication dédié ;
sa publication manuelle reste hors du formulaire Webbing. Le staging est séparé.

## Installation et arrêt

Appliquer la migration `004-owner-publications.sql` avant de publier le code.
Prévoir un accès Vercel chiffré pour chaque projet. Pour Pattùs seulement,
`scripts/gestion/provision-publication.mjs pattushotel --owner-push` autorise le
provisionnement dédié à ce circuit sans l’ajouter au formulaire manuel.

Depuis le checkout vérifié et les sessions CLI existantes, lancer :

```sh
NODE_OPTIONS=--conditions=react-server pnpm exec tsx scripts/gestion/provision-owner-publications.mjs --enable
```

Sans `--enable`, la commande vérifie seulement les prérequis. `--disable`
désactive les règles et leurs webhooks. La désactivation bloque toute nouvelle
promotion personnelle ; les opérations déjà envoyées restent réconciliées.
Les secrets ne sont jamais imprimés. Une règle existante et cohérente n’est
pas réinitialisée lors d’un second lancement.
