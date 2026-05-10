export const KNITSPEED_SITE_URL = "https://knitspeed-homepage.vercel.app";

const ORGANIZATION_ID = `${KNITSPEED_SITE_URL}/#organization`;

export function getCanonicalKnowledgeUrl(slug) {
  return `${KNITSPEED_SITE_URL}/knowledge/${slug}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Knitspeed",
    legalName: "GSC Import Export Co., Ltd.",
    url: KNITSPEED_SITE_URL,
    description:
      "Knitspeed supports knitted fabric sourcing discussions for buyers working with Thailand textile suppliers.",
    areaServed: "Thailand",
    knowsAbout: [
      "knitted fabric sourcing support",
      "Thailand textile supplier",
      "Single Jersey fabric",
      "Interlock fabric",
    ],
  };
}

export function buildArticleSchema(page) {
  const url = getCanonicalKnowledgeUrl(page.slug);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.metaDescription || page.subtitle,
    url,
    mainEntityOfPage: url,
    about: ["Single Jersey fabric", "Interlock fabric", "knitted fabric selection"],
    author: {
      "@id": ORGANIZATION_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export function buildFAQPageSchema(page) {
  const url = getCanonicalKnowledgeUrl(page.slug);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
