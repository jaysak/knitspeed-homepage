export const KNITSPEED_SITE_URL = "https://knitspeed-homepage.vercel.app";

const ORGANIZATION_ID = `${KNITSPEED_SITE_URL}/#organization`;

export function getCanonicalKnowledgeUrl(pageOrSlug) {
  const path =
    typeof pageOrSlug === "string"
      ? `/knowledge/${pageOrSlug}`
      : pageOrSlug.canonicalPath || `/knowledge/${pageOrSlug.slug}`;

  return `${KNITSPEED_SITE_URL}${path}`;
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
      "Compact Cotton",
      "knitted fabric structures",
      "apparel fabric sourcing",
    ],
  };
}

export function buildArticleSchema(page) {
  const url = getCanonicalKnowledgeUrl(page);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.metaDescription || page.subtitle,
    url,
    mainEntityOfPage: url,
    about: page.tags?.length
      ? page.tags
      : ["knitted fabric selection", "apparel fabric sourcing"],
    articleSection: page.category,
    author: {
      "@id": ORGANIZATION_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export function buildFAQPageSchema(page) {
  const url = getCanonicalKnowledgeUrl(page);

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

export function buildKnowledgeCollectionSchema(pages) {
  const url = `${KNITSPEED_SITE_URL}/knowledge`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: "Knitspeed Textile Knowledge",
    description:
      "Practical knitted fabric sourcing guidance from Knitspeed and GSC Import Export Co., Ltd.",
    url,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    hasPart: pages.map((page) => ({
      "@type": "Article",
      name: page.title,
      url: getCanonicalKnowledgeUrl(page),
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
