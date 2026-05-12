/* global process */

import { TEXTILE_KNOWLEDGE_PAGES } from "../src/data/textileKnowledgePages.js";
import { buildAbsoluteUrl } from "../src/lib/siteConfig.js";

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

const canonicalSet = new Set();
const routeSet = new Set();

for (const page of TEXTILE_KNOWLEDGE_PAGES) {
  const slug = page.slug;

  if (!slug) {
    addError("Knowledge page missing slug.");
    continue;
  }

  const expectedPath = `/knowledge/${slug}`;

  if (page.canonicalPath !== expectedPath) {
    addError(
      `${slug}: canonicalPath mismatch (${page.canonicalPath})`
    );
  }

  const absoluteUrl = buildAbsoluteUrl(expectedPath);

  if (!absoluteUrl.startsWith("https://")) {
    addError(`${slug}: canonical URL must use https`);
  }

  if (absoluteUrl.includes("localhost")) {
    addError(`${slug}: canonical URL contains localhost`);
  }

  if (canonicalSet.has(absoluteUrl)) {
    addError(`${slug}: duplicate canonical URL`);
  }

  canonicalSet.add(absoluteUrl);

  if (routeSet.has(expectedPath)) {
    addError(`${slug}: duplicate route path`);
  }

  routeSet.add(expectedPath);

  if (expectedPath.includes("//")) {
    addError(`${slug}: malformed route path`);
  }

  if (!page.title) {
    addWarning(`${slug}: missing title`);
  }

  if (!page.metaDescription) {
    addWarning(`${slug}: missing metaDescription`);
  }
}

console.log(`Verified ${TEXTILE_KNOWLEDGE_PAGES.length} deployment routes.`);

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

console.log("Deployment integrity verification passed.");
