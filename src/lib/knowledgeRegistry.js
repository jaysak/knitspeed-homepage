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

  if (!page) {
    return [];
  }

  const explicitRelatedPages = (page.relatedArticleSlugs || [])
    .filter((relatedSlug) => implementedKnowledgeSlugs.has(relatedSlug))
    .map((relatedSlug) => getKnowledgePageBySlug(relatedSlug))
    .filter(Boolean);

  const explicitSlugs = new Set(
    explicitRelatedPages.map((relatedPage) => relatedPage.slug)
  );

  const clusterFallbackPages = getAllKnowledgePages()
    .filter((candidatePage) => {
      if (candidatePage.slug === page.slug) {
        return false;
      }

      if (explicitSlugs.has(candidatePage.slug)) {
        return false;
      }

      return (
        candidatePage.topicCluster &&
        candidatePage.topicCluster === page.topicCluster
      );
    })
    .slice(0, 2);

  return [...explicitRelatedPages, ...clusterFallbackPages];
}

export function getKnowledgeTopicClusters() {
  const clusters = new Map();

  getAllKnowledgePages().forEach((page) => {
    const clusterKey = page.topicCluster || "general";
    const existing = clusters.get(clusterKey) || {
      key: clusterKey,
      label: formatClusterLabel(clusterKey),
      pages: [],
    };

    existing.pages.push(page);
    clusters.set(clusterKey, existing);
  });

  return Array.from(clusters.values());
}

export function getKnowledgePagesByCluster(clusterKey) {
  return getAllKnowledgePages().filter(
    (page) => (page.topicCluster || "general") === clusterKey
  );
}

function formatClusterLabel(clusterKey) {
  return clusterKey
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getKnowledgePageFromPathname(pathname) {
  if (!pathname?.startsWith("/knowledge/")) {
    return null;
  }

  const slug = pathname.replace("/knowledge/", "").replace(/\/$/, "");

  return getKnowledgePageBySlug(slug);
}
