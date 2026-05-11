function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

function unique(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function getRecommendedOperationalChecks(page = {}, context = {}) {
  const checks = [];

  if (
    includesAny(page.riskSignals, ["shrinkage-risk", "dimensional-stability"]) ||
    context?.sourcingStability?.stabilityLevel === "sensitive"
  ) {
    checks.push("Confirm wash testing expectations before bulk production.");
  }

  if (
    includesAny(page.riskSignals, ["shade-consistency"]) ||
    includesAny(page.processFamilies, ["dyeing"])
  ) {
    checks.push("Clarify lab dip, bulk shade tolerance, and approval process early.");
  }

  if (includesAny(page.processFamilies, ["finishing"])) {
    checks.push("Align finishing target, hand feel, and dimensional stability before quotation.");
  }

  if (context?.urgency?.urgencyLevel === "elevated") {
    checks.push("Discuss timeline pressure before sampling or bulk planning.");
  }

  return unique(checks);
}

function getRecommendedSamplingFocus(page = {}, context = {}) {
  const focus = [];

  if (includesAny(page.fabricFamilies, ["single-jersey", "interlock"])) {
    focus.push("structure behavior");
  }

  if (includesAny(page.yarnFamilies, ["compact-cotton", "combed-cotton"])) {
    focus.push("yarn hand feel consistency");
  }

  if (includesAny(page.processFamilies, ["dyeing"])) {
    focus.push("shade approval");
  }

  if (includesAny(page.processFamilies, ["finishing"])) {
    focus.push("finishing feel and stability");
  }

  if (context?.buyerIntentProgression?.samplingLikelihood === "high") {
    focus.push("pre-bulk sample confirmation");
  }

  return unique(focus);
}

function getRecommendedDiscussionTopics(page = {}, context = {}) {
  const topics = [];

  if (context?.buyerIntentProgression?.sourcingReadiness === "near-sourcing") {
    topics.push("production timeline");
    topics.push("bulk approval expectations");
  }

  if (context?.sourcingStability?.stabilityLevel !== "stable") {
    topics.push("repeatability between sample and bulk");
  }

  if (includesAny(page.riskSignals, ["shade-consistency"])) {
    topics.push("shade tolerance");
  }

  if (includesAny(page.riskSignals, ["dimensional-stability", "shrinkage-risk"])) {
    topics.push("washing and shrinkage expectations");
  }

  return unique(topics);
}

export function getOperationalRecommendations(page = {}, context = {}) {
  return {
    recommendedOperationalChecks: getRecommendedOperationalChecks(page, context),
    recommendedSamplingFocus: getRecommendedSamplingFocus(page, context),
    recommendedDiscussionTopics: getRecommendedDiscussionTopics(page, context)
  };
}
