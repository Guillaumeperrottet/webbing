import Script from "next/script";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webbing",
    url: "https://webbing.ch",
    logo: "https://webbing.ch/logo.png",
    description:
      "Créateur de solutions SaaS sur mesure pour les entreprises suisses",
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
      availableLanguage: ["French"],
    },
    founder: {
      "@type": "Person",
      name: "Guillaume Perrottet",
    },
    sameAs: [],
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
    image: "https://webbing.ch/logo.png",
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
