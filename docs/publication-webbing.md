# Publier depuis Webbing Gestion

Dans **Déploiements**, choisir une application puis **Préparer la publication**.
La préparation ne lance ni build, ni test GitHub, ni promotion. Webbing recherche
un build de production Vercel prêt et non encore promu, provenant de la révision
principale actuelle de GitHub, intégrée par PR. Les aperçus, les envois locaux et
les historiques divergents sont refusés. Les projets de staging et Pattùs sont
exclus de ce circuit.

Le contrôle `Webbing / Quality` doit avoir réellement exécuté avec succès
`Locked dependencies, tests, build and startup` sur cette révision finale.
Un test absent, ignoré, en attente ou bloqué par le budget bloque la publication.
Webbing ne le relance pas. Les propositions de dépendances et leurs versions
majeures conservent leur validation séparée ; leur fusion ne publie rien.

Le récapitulatif affiche les domaines, les deux révisions, le build préparé, la
PR et les contrôles. Vérifier les parcours importants sur ce build et la
compatibilité des changements avec la base de production, puis cocher la
confirmation et saisir un **code TOTP récent**. Une session déjà ouverte ou un
code de secours ne remplace pas cette étape. La préparation expire après dix
minutes et appartient à la session qui l’a créée.

Le serveur revérifie les preuves, réserve la demande une seule fois, puis
promeut le build exact sans reconstruction. Il réapplique et relit
`autoAssignCustomDomains: false`, puis vérifie le déploiement servi par chaque
domaine. « En ligne » indique que ces vérifications ont réussi à cet instant ;
cela ne constitue pas une garantie fonctionnelle de toutes les pages.

## Réponse incertaine et protection

Un double clic, un nouvel envoi du formulaire ou une réponse perdue ne renvoie
jamais automatiquement une promotion. La demande reste dans le suivi et bloque
la suivante pour le même projet. **Actualiser le suivi** fait uniquement des
lectures. Une panne ou une réponse incertaine peut nécessiter une vérification
par le propriétaire dans Vercel ; ne pas supprimer la réservation pour forcer
un nouvel envoi sans avoir contrôlé la demande précédente.

Une promotion Vercel peut réactiver l’attribution automatique des domaines.
Le serveur la désactive immédiatement après l’envoi. Si le processus s’arrête
à cet instant, le contrôle périodique existant réessaie uniquement cette
désactivation et vérifie le résultat, sans nouvelle promotion. Ce mécanisme
n’est pas une opération atomique avec Vercel : un administrateur peut encore
publier ou changer la configuration directement dans Vercel.

## Accès de publication

Les accès sont distincts des notifications signées Vercel. Chaque jeton est
émis pour un seul projet, expire après 90 jours et reste chiffré dans la base
de gestion. Aucun jeton n’est transmis au navigateur. Le provisionnement
refuse un jeton qui permettrait de lire un autre projet autorisé.

Le propriétaire peut créer ou renouveler l’accès d’un projet depuis sa session
CLI Vercel authentifiée, dans un checkout vérifié contenant les variables de
gestion :

```sh
NODE_OPTIONS=--conditions=react-server pnpm exec tsx scripts/gestion/provision-publication.mjs webbing
```

La commande capture le nouveau jeton en mémoire et l’enregistre immédiatement
chiffré ; elle n’imprime aucune clé. Après renouvellement, révoquer l’ancien
jeton correspondant dans Vercel. **Connexions** affiche l’expiration et permet
de retirer l’accès de Webbing hors publication en cours. Cela supprime la copie
chiffrée ; la révocation du jeton chez Vercel reste une opération du propriétaire.

Les confirmations TOTP sont limitées à cinq tentatives par compte sur cinq
minutes, toutes sessions confondues. Seule une empreinte HMAC du code est
conservée temporairement pour empêcher sa réutilisation entre publications.
Ni code, ni secret TOTP, ni jeton de session ne sont inscrits dans le journal.
