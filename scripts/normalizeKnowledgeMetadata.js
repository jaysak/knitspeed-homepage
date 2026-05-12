import { readFileSync, writeFileSync } from "node:fs";
import { TEXTILE_KNOWLEDGE_PAGES } from "../src/data/textileKnowledgePages.js";

const FILE_PATH = "src/data/textileKnowledgePages.js";

const TOPIC_CLUSTER_NORMALIZATION = {
  "Fabric Structures": "fabric-structures",
  "Fabric Behavior": "fabric-behavior",
  "Fabric Specification": "fabric-specification",
  "Fabric Finishing": "fabric-finishing",
  "Textile Production": "textile-production",
  "Yarn Quality": "yarn-quality",
  "Fabric Dyeing": "fabric-dyeing",
  "Garment Production": "garment-production",
  "Decoration Printing": "decoration-printing",
};

const CATEGORY_BY_CLUSTER = {
  "fabric-structures": "Fabric structures",
  "fabric-behavior": "Fabric behavior",
  "fabric-specification": "Fabric specification",
  "fabric-finishing": "Fabric finishing",
  "textile-production": "Textile production",
  "yarn-quality": "Yarn quality",
  "fabric-dyeing": "Fabric dyeing",
  "garment-production": "Garment production",
  "decoration-printing": "Decoration printing",
};

function quote(value) {
  return JSON.stringify(value);
}

function getSafeSubtitle(page) {
  if (typeof page.subtitle === "string" && page.subtitle.trim()) {
    return page.subtitle;
  }

  if (typeof page.shortAnswer === "string" && page.shortAnswer.trim()) {
    const firstSentence = page.shortAnswer.split(". ")[0].trim();
    return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }

  return `A practical Knitspeed guide to ${page.title || page.slug}.`;
}

function getNormalizedCluster(page) {
  return TOPIC_CLUSTER_NORMALIZATION[page.topicCluster] || page.topicCluster;
}

const updates = new Map();

TEXTILE_KNOWLEDGE_PAGES.forEach((page, index) => {
  if (!page.slug) {
    return;
  }

  const topicCluster = getNormalizedCluster(page);
  const category = page.category || CATEGORY_BY_CLUSTER[topicCluster] || "Textile knowledge";

  updates.set(page.slug, {
    canonicalPath: `/knowledge/${page.slug}`,
    topicCluster,
    category,
    subtitle: getSafeSubtitle(page),
    discoveryPriority:
      Number.isFinite(page.discoveryPriority)
        ? page.discoveryPriority
        : (index + 1) * 10,
  });
});

let text = readFileSync(FILE_PATH, "utf8");
let changedCount = 0;

for (const [slug, update] of updates.entries()) {
  const slugPattern = new RegExp(`(\\{\\s*slug:\\s*"${slug}"[\\s\\S]*?)(?=\\n\\s*\\},?\\n)`, "m");
  const match = text.match(slugPattern);

  if (!match) {
    console.warn(`Could not find object for slug ${slug}`);
    continue;
  }

  let objectText = match[1];
  let nextObjectText = objectText;

  if (/canonicalPath:\s*"/.test(nextObjectText)) {
    nextObjectText = nextObjectText.replace(
      /canonicalPath:\s*"[^"]*"/,
      `canonicalPath: ${quote(update.canonicalPath)}`
    );
  } else {
    nextObjectText = nextObjectText.replace(
      /(slug:\s*"[^"]+",)/,
      `$1\n    canonicalPath: ${quote(update.canonicalPath)},`
    );
  }

  if (/category:\s*"/.test(nextObjectText)) {
    nextObjectText = nextObjectText.replace(
      /category:\s*"[^"]*"/,
      `category: ${quote(update.category)}`
    );
  } else {
    nextObjectText = nextObjectText.replace(
      /(canonicalPath:\s*"[^"]+",)/,
      `$1\n    category: ${quote(update.category)},`
    );
  }

  if (/discoveryPriority:\s*[-\d.]+/.test(nextObjectText)) {
    nextObjectText = nextObjectText.replace(
      /discoveryPriority:\s*[-\d.]+/,
      `discoveryPriority: ${update.discoveryPriority}`
    );
  } else {
    nextObjectText = nextObjectText.replace(
      /(category:\s*"[^"]+",)/,
      `$1\n    discoveryPriority: ${update.discoveryPriority},`
    );
  }

  if (/topicCluster:\s*"/.test(nextObjectText)) {
    nextObjectText = nextObjectText.replace(
      /topicCluster:\s*"[^"]*"/,
      `topicCluster: ${quote(update.topicCluster)}`
    );
  } else {
    nextObjectText = nextObjectText.replace(
      /(discoveryPriority:\s*[-\d.]+,)/,
      `$1\n    topicCluster: ${quote(update.topicCluster)},`
    );
  }

  if (/subtitle:\s*"/.test(nextObjectText)) {
    nextObjectText = nextObjectText.replace(
      /subtitle:\s*"[^"]*"/,
      `subtitle: ${quote(update.subtitle)}`
    );
  } else {
    nextObjectText = nextObjectText.replace(
      /(title:\s*"[^"]+",)/,
      `$1\n    subtitle: ${quote(update.subtitle)},`
    );
  }

  if (nextObjectText !== objectText) {
    text = text.replace(objectText, nextObjectText);
    changedCount += 1;
  }
}

writeFileSync(FILE_PATH, text);
console.log(`Normalized metadata for ${changedCount} knowledge pages.`);
