import { TEXTILE_KNOWLEDGE_PAGES } from "../data/textileKnowledgePages";

const implementedKnowledgeSlugs = new Set(
  TEXTILE_KNOWLEDGE_PAGES.map((page) => page.slug)
);

export function getAllKnowledgePages() {
  return [...TEXTILE_KNOWLEDGE_PAGES].sort(
    (a, b) => (a.discoveryPriority ?? 999) - (b.discoveryPriority ?? 999)
  );
}

export function getKnowledgePageBySlug(slug) {
  return TEXTILE_KNOWLEDGE_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getRelatedKnowledgePages(slug) {
  const page = getKnowledgePageBySlug(slug);

  if (!page?.relatedArticleSlugs?.length) {
    return [];
  }

  return page.relatedArticleSlugs
    .filter((relatedSlug) => implementedKnowledgeSlugs.has(relatedSlug))
    .map((relatedSlug) => getKnowledgePageBySlug(relatedSlug))
    .filter(Boolean);
}
