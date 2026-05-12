/* global process */
import { TEXTILE_KNOWLEDGE_PAGES } from "../src/data/textileKnowledgePages.js";

const APPROVED_TOPIC_CLUSTERS = new Set([
  "fabric-structures",
  "yarn-quality",
  "fabric-specification",
  "fabric-behavior",
  "fabric-finishing",
  "fabric-dyeing",
  "textile-production",
  "garment-production",
  "decoration-printing",
]);

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

const slugSet = new Set();
const canonicalPathSet = new Set();

for (const page of TEXTILE_KNOWLEDGE_PAGES) {
  const label = page.slug || page.title || "unknown page";

  if (!isNonEmptyString(page.slug)) {
    addError(`${label}: missing slug`);
    continue;
  }

  if (slugSet.has(page.slug)) {
    addError(`${page.slug}: duplicate slug`);
  }
  slugSet.add(page.slug);

  const expectedCanonicalPath = `/knowledge/${page.slug}`;

  if (page.canonicalPath !== expectedCanonicalPath) {
    addError(
      `${page.slug}: canonicalPath should be ${expectedCanonicalPath}, found ${page.canonicalPath}`
    );
  }

  if (canonicalPathSet.has(page.canonicalPath)) {
    addError(`${page.slug}: duplicate canonicalPath ${page.canonicalPath}`);
  }
  canonicalPathSet.add(page.canonicalPath);

  if (!isNonEmptyString(page.title)) {
    addError(`${page.slug}: missing title`);
  }

  if (!isNonEmptyString(page.subtitle)) {
    addError(`${page.slug}: missing subtitle`);
  }

  if (!isNonEmptyString(page.metaDescription)) {
    addError(`${page.slug}: missing metaDescription`);
  }

  if (!isNonEmptyString(page.shortAnswer)) {
    addError(`${page.slug}: missing shortAnswer`);
  }

  if (!isNonEmptyString(page.category)) {
    addError(`${page.slug}: missing category`);
  }

  if (!isNonEmptyString(page.topicCluster)) {
    addError(`${page.slug}: missing topicCluster`);
  } else if (!APPROVED_TOPIC_CLUSTERS.has(page.topicCluster)) {
    addError(`${page.slug}: unknown topicCluster ${page.topicCluster}`);
  }

  if (!Number.isFinite(page.discoveryPriority)) {
    addWarning(`${page.slug}: missing numeric discoveryPriority`);
  }

  if (!isNonEmptyArray(page.tags)) {
    addError(`${page.slug}: missing tags`);
  }

  if (!isNonEmptyArray(page.faqs)) {
    addError(`${page.slug}: missing faqs`);
  } else {
    for (const [index, faq] of page.faqs.entries()) {
      if (!isNonEmptyString(faq.question)) {
        addError(`${page.slug}: FAQ ${index + 1} missing question`);
      }
      if (!isNonEmptyString(faq.answer)) {
        addError(`${page.slug}: FAQ ${index + 1} missing answer`);
      }
    }
  }

  if (page.relatedArticleSlugs?.includes(page.slug)) {
    addError(`${page.slug}: relatedArticleSlugs includes itself`);
  }
}

for (const page of TEXTILE_KNOWLEDGE_PAGES) {
  for (const relatedSlug of page.relatedArticleSlugs || []) {
    if (!slugSet.has(relatedSlug)) {
      addError(`${page.slug}: broken relatedArticleSlug ${relatedSlug}`);
    }
  }
}

console.log(`Checked ${TEXTILE_KNOWLEDGE_PAGES.length} knowledge pages.`);

if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length}`);
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error(`Errors: ${errors.length}`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Knowledge integrity verification passed.");
