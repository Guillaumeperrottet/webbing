# Référencement du site public

Le site de présentation est une page unique, canonique à `https://www.webbing.ch/`.
Les fragments (`#selfcamp`, `#contact`…) servent à sa navigation ; ce ne sont pas
des pages distinctes. `/applications`, `/projets`, `/about` et `/contact` restent
des redirections permanentes et ne doivent pas être ajoutés au sitemap.

`src/app/sitemap.ts` déclare la page et les neuf captures principales du portfolio,
avec l’extension XML pour les images. Les captures de comptes internes sont
exclues. Le sitemap est annoncé dans `robots.txt` ; les routes de gestion et API
restent exclues de l’exploration.

Mettre `publicContentUpdatedAt` dans `src/data/site-meta.ts` à jour lors d’une
modification substantielle des contenus publics. Ne pas fabriquer une nouvelle
date à chaque build. Les titres, descriptions et l’origine canonique y sont
également centralisés.

Le graphe JSON-LD est rendu côté serveur par `StudioStructuredData` : une seule
identité `LocalBusiness`, le site, la page, les deux services et les neuf projets.
Conserver les crédits de conception des collaborateurs. N’ajouter des horaires,
coordonnées GPS, prix ou avis que lorsqu’ils sont vérifiés et cohérents avec
le contenu visible.

Contrôles ciblés :

```sh
node --import tsx --test tests/project-swipe.test.ts tests/site-seo.test.ts
```

Après publication, contrôler le XML public et l’inspection d’URL dans la propriété
Google Search Console vérifiée. La présence du fichier ne constitue pas la preuve
d’une soumission à Search Console ni d’une indexation. Pour développer la visibilité
sur plusieurs besoins, créer de vraies pages de services utiles et liées depuis
le site, avec leur propre contenu et URL canonique, avant de les ajouter au sitemap.

Références :
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
