import { getManufacturingSensitivity } from "./operations/manufacturingSensitivity";
import { getOperationalContextForPage, summarizeOperationalContext } from "./operations/operationalContext";
import { getTemporalManufacturingSignals } from "./intelligence/temporalManufacturingSignals"
import { TEXTILE_KNOWLEDGE_PAGES } from "../data/textileKnowledgePages";
import { getProductionMemory } from "./production/productionMemory";
import { getRelationshipWeight } from "./intelligence/relationshipWeights";
import { getManufacturingCausalitySummary } from "./intelligence/manufacturingCausality";

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

      return scoreKnowledgeRelationship(page, candidatePage) > 0;
    })
    .sort((a, b) => {
      return scoreKnowledgeRelationship(page, b) - scoreKnowledgeRelationship(page, a);
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


export function getKnowledgeFreshnessBadge(page) {
  if (!page?.publishedAt && !page?.updatedAt) {
    return null;
  }

  const now = new Date();
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  const publishedAt = page.publishedAt
    ? new Date(page.publishedAt)
    : null;

  const updatedAt = page.updatedAt
    ? new Date(page.updatedAt)
    : null;

  if (
    publishedAt &&
    now - publishedAt <= THIRTY_DAYS
  ) {
    return {
      label: "New",
      tone: "new",
    };
  }

  if (
    updatedAt &&
    now - updatedAt <= THIRTY_DAYS
  ) {
    return {
      label: "Updated",
      tone: "updated",
    };
  }

  return null;
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


const PRODUCTION_MEMORY_SLUG_MAP = {
  "single-jersey-vs-interlock": ["single-jersey", "interlock"],
  "what-is-compact-cotton": ["compact-cotton"],
  "what-gsm-should-t-shirts-use": ["single-jersey"]
};

export function getKnowledgePageProductionMemory(slug) {
  const memoryKeys = PRODUCTION_MEMORY_SLUG_MAP[slug] || [];

  return memoryKeys
    .map((memoryKey) => ({
      key: memoryKey,
      memory: getProductionMemory(memoryKey)
    }))
    .filter((item) => Boolean(item.memory));
}


export function getKnowledgePageTemporalSignals(slug) {
  const page = getKnowledgePageBySlug(slug);

  if (!page) {
    return null;
  }

  return getTemporalManufacturingSignals(page);
}


export function getKnowledgePageOperationalContext(slug) {
  const page = getKnowledgePageBySlug(slug);

  if (!page) {
    return null;
  }

  const signals = getOperationalContextForPage(page);

  return {
    signals,
    summary: summarizeOperationalContext(signals)
  };
}


export function getKnowledgePageManufacturingSensitivity(slug) {
  const page = getKnowledgePageBySlug(slug);

  if (!page) {
    return null;
  }

  return getManufacturingSensitivity(page);
}

export function getKnowledgePageManufacturingCausality(slug) {
  return getManufacturingCausalitySummary(slug);
}


function countSharedValues(sourceValues = [], candidateValues = []) {
  const sourceSet = new Set(sourceValues || []);

  return (candidateValues || []).filter((value) => sourceSet.has(value)).length;
}

function getSharedCausalityCount(sourcePage, candidatePage) {
  const sourceCausality =
    getKnowledgePageManufacturingCausality(sourcePage.slug);

  const candidateCausality =
    getKnowledgePageManufacturingCausality(candidatePage.slug);

  const sourceAreas =
    sourceCausality?.affectedAreas || [];

  const candidateAreas =
    candidateCausality?.affectedAreas || [];

  return countSharedValues(sourceAreas, candidateAreas);
}

function scoreKnowledgeRelationship(sourcePage, candidatePage) {
  if (!sourcePage || !candidatePage) return 0;

  let score = 0;

  if (sourcePage.topicCluster && sourcePage.topicCluster === candidatePage.topicCluster) {
    score += 0.35;
  }

  if (sourcePage.buyerIntent && sourcePage.buyerIntent === candidatePage.buyerIntent) {
    score += 0.2;
  }

  const sourceTags = new Set(sourcePage.tags || []);
  const candidateTags = candidatePage.tags || [];
  const sharedTags = candidateTags.filter((tag) => sourceTags.has(tag));

  score += sharedTags.length * 0.08;

  score += countSharedValues(sourcePage.fabricFamilies, candidatePage.fabricFamilies) * 0.14;
  score += countSharedValues(sourcePage.yarnFamilies, candidatePage.yarnFamilies) * 0.12;
  score += countSharedValues(sourcePage.processFamilies, candidatePage.processFamilies) * 0.1;
  score += countSharedValues(sourcePage.riskSignals, candidatePage.riskSignals) * 0.16;
  score += getSharedCausalityCount(sourcePage, candidatePage) * 0.05;

  if (
    sourcePage.buyerJourneyStage &&
    sourcePage.buyerJourneyStage === candidatePage.buyerJourneyStage
  ) {
    score += 0.12;
  }

  if (
    sourcePage.topicCluster === "yarn-quality" &&
    candidatePage.topicCluster === "fabric-specification"
  ) {
    score += getRelationshipWeight("yarn-to-structure")?.weight || 0;
  }

  if (
    sourcePage.topicCluster === "fabric-structures" &&
    candidatePage.topicCluster === "fabric-specification"
  ) {
    score += getRelationshipWeight("structure-to-dyeing")?.weight || 0;
  }

  return Number(score.toFixed(2));
}


export function getProductionSensitiveKnowledgePages() {
  return getAllKnowledgePages()
    .map((page) => ({
      ...page,
      manufacturingSensitivity: getKnowledgePageManufacturingSensitivity(page.slug)
    }))
    .filter((page) => {
      const level = page.manufacturingSensitivity?.level;
      return level === "high" || level === "moderate";
    })
    .sort((a, b) => {
      return (
        (b.manufacturingSensitivity?.score || 0) -
        (a.manufacturingSensitivity?.score || 0)
      );
    })
    .slice(0, 6);
}
