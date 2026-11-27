import { siteDescription, siteTitle, siteUrl, publicContentUpdatedAt } from "@/data/site-meta";
import { showcaseProjects, projectContributions } from "@/data/portfolio";
import { projectPresentations } from "@/data/project-presentations";

const studioId = `${siteUrl}#studio`;
const areaServed = { "@type": "Place", name: "Suisse romande" };

// Only representative public captures; account screens stay out of image discovery.
export const sitemapImages = [...new Set(showcaseProjects.map((project) => new URL(projectPresentations[project.id].screenshot.src, siteUrl).href))];

export const studioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness", "@id": studioId,
      name: "Webbing", alternateName: "Webbing Informatique", url: siteUrl,
      description: siteDescription,
      logo: { "@type": "ImageObject", url: new URL("/logo-square.png", siteUrl).href },
      image: new URL("/logo-square.png", siteUrl).href,
      telephone: "+41793414074", email: "gp@webbing.ch",
      address: { "@type": "PostalAddress", streetAddress: "Rue de Battentin 1", addressLocality: "Bulle", addressRegion: "Fribourg", postalCode: "1630", addressCountry: "CH" },
      founder: { "@type": "Person", name: "Guillaume Perrottet" },
      sameAs: ["https://github.com/Guillaumeperrottet"], areaServed,
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Sites et applications sur mesure", itemListElement: [
        { "@type": "Offer", itemOffered: { "@id": `${siteUrl}#service-sites-web` } },
        { "@type": "Offer", itemOffered: { "@id": `${siteUrl}#service-applications-web` } },
      ] },
    },
    { "@type": "WebSite", "@id": `${siteUrl}#website`, name: "Webbing", url: siteUrl, inLanguage: "fr-CH", publisher: { "@id": studioId } },
    { "@type": "WebPage", "@id": `${siteUrl}#webpage`, url: siteUrl, name: siteTitle, description: siteDescription, inLanguage: "fr-CH", dateModified: publicContentUpdatedAt, isPartOf: { "@id": `${siteUrl}#website` }, about: { "@id": studioId }, mainEntity: { "@id": studioId } },
    { "@type": "Service", "@id": `${siteUrl}#service-sites-web`, name: "Création de sites internet sur mesure", serviceType: "Conception et développement de sites web", provider: { "@id": studioId }, areaServed, url: `${siteUrl}#sites-web` },
    { "@type": "Service", "@id": `${siteUrl}#service-applications-web`, name: "Développement d’applications web sur mesure", serviceType: "Conception et développement d’applications web", provider: { "@id": studioId }, areaServed, url: `${siteUrl}#applications` },
    {
      "@type": "ItemList", "@id": `${siteUrl}#realisations`, name: "Réalisations de Webbing", numberOfItems: showcaseProjects.length,
      itemListElement: showcaseProjects.map((project, index) => ({
        "@type": "ListItem", position: index + 1,
        item: { "@type": "CreativeWork", "@id": `${siteUrl}#${project.id}`, name: project.name, url: project.url,
          description: projectPresentations[project.id].description,
          image: new URL(projectPresentations[project.id].screenshot.src, siteUrl).href,
          contributor: { "@id": studioId }, creditText: projectContributions[project.id] },
      })),
    },
  ],
};
