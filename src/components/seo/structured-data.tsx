import Script from "next/script";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webbing",
    alternateName: "Webbing Informatique",
    url: "https://webbing.ch",
    logo: {
      "@type": "ImageObject",
      url: "https://webbing.ch/logo-square.png",
      width: "512",
      height: "512",
    },
    image: "https://webbing.ch/logo-square.png",
    description:
      "Créateur de solutions web sur mesure pour les entreprises suisses. Développement d'applications et de sites modernes : Wisp, SelfCamp, PlanniKeeper, OpenWind.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue de Battentin 1",
      addressLocality: "Bulle",
      postalCode: "1630",
      addressCountry: "CH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+41-79-341-40-74",
      contactType: "customer service",
      email: "gp@webbing.ch",
      availableLanguage: ["French", "fr-CH"],
    },
    founder: {
      "@type": "Person",
      name: "Guillaume Perrottet",
    },
    sameAs: ["https://github.com/Guillaumeperrottet"],
    areaServed: {
      "@type": "Country",
      name: "Switzerland",
    },
    serviceType: [
      "Développement Web",
      "Solutions web",
      "Applications Web sur mesure",
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Webbing",
    image: "https://webbing.ch/logo-square.png",
    logo: "https://webbing.ch/logo-square.png",
    "@id": "https://webbing.ch",
    url: "https://webbing.ch",
    telephone: "+41793414074",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue de Battentin 1",
      addressLocality: "Bulle",
      postalCode: "1630",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.6183,
      longitude: 7.0563,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
