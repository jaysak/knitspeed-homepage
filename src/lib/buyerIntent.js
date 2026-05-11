import {
  calculateWeightedIntentScore,
  getWeightedIntentTier
} from "./intelligence/relationshipWeights";

const BUYER_INTENT_STORAGE_KEY = "knitspeed_buyer_intent_events";
const MAX_BUYER_INTENT_EVENTS = 100;

function hasLocalStorage() {
  return (
    typeof localStorage !== "undefined" &&
    typeof localStorage.getItem === "function"
  );
}


function unique(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

export function readBuyerIntentEvents() {
  if (!hasLocalStorage()) {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem(BUYER_INTENT_STORAGE_KEY) || "[]"
    );
  } catch (error) {
    console.warn("Could not read buyer intent events:", error);
    return [];
  }
}

export function writeBuyerIntentEvent(
  eventType,
  article,
  details = {}
) {
  if (!article?.seoSlug) return null;

  const event = {
    event_type: eventType,
    article_name: article.articleName,
    article_slug: article.seoSlug,
    usage_segment: article.usageSegment,
    material_family: article.materialFamily,
    fabric_structure: article.fabricStructure,
    linked_products: article.linkedProducts,

    topic_cluster:
      article.topicCluster ||
      article.topic_cluster ||
      null,

    process_families:
      article.processFamilies ||
      article.process_families ||
      [],

    risk_signals:
      article.riskSignals ||
      article.risk_signals ||
      [],

    buyer_journey_stage:
      article.buyerJourneyStage ||
      article.buyer_journey_stage ||
      null,

    created_at: new Date().toISOString(),
    ...details,
  };

  if (!hasLocalStorage()) {
    return event;
  }

  const events = readBuyerIntentEvents();

  events.push(event);

  localStorage.setItem(
    BUYER_INTENT_STORAGE_KEY,
    JSON.stringify(events.slice(-MAX_BUYER_INTENT_EVENTS))
  );

  return event;
}

function getOperationalThemes(events = []) {
  const themes = [];

  const allProcesses = events.flatMap(
    (event) => event.process_families || []
  );

  const allRisks = events.flatMap(
    (event) => event.risk_signals || []
  );

  if (
    includesAny(allRisks, [
      "dimensional-stability",
      "shrinkage-risk",
      "wash behavior",
      "wash-behavior"
    ])
  ) {
    themes.push("wash durability");
  }

  if (
    includesAny(allProcesses, [
      "printing",
      "screen printing",
      "heat transfer"
    ]) ||
    includesAny(allRisks, [
      "print cracking",
      "surface peeling",
      "surface aging",
      "print stiffness"
    ])
  ) {
    themes.push("decoration durability");
  }

  if (
    includesAny(allRisks, [
      "yield-sensitivity",
      "consumption-variation",
      "marker-efficiency"
    ])
  ) {
    themes.push("garment yield optimization");
  }

  if (
    includesAny(allProcesses, [
      "dyeing",
      "finishing"
    ])
  ) {
    themes.push("production consistency");
  }

  return unique(themes);
}

function getRepeatedConcernFamilies(events = []) {
  const allRisks = events.flatMap(
    (event) => event.risk_signals || []
  );

  const concerns = [];

  if (
    includesAny(allRisks, [
      "dimensional-stability",
      "shrinkage-risk"
    ])
  ) {
    concerns.push("dimensional stability");
  }

  if (
    includesAny(allRisks, [
      "shade-consistency",
      "shade variation"
    ])
  ) {
    concerns.push("shade consistency");
  }

  if (
    includesAny(allRisks, [
      "print cracking",
      "surface peeling",
      "surface aging",
      "print stiffness"
    ])
  ) {
    concerns.push("print behavior");
  }

  if (
    includesAny(allRisks, [
      "yield-sensitivity",
      "consumption-variation"
    ])
  ) {
    concerns.push("garment yield");
  }

  return unique(concerns);
}

function getSourcingTrajectory(events = []) {
  const stages = unique(
    events
      .map((event) => event.buyer_journey_stage)
      .filter(Boolean)
  );

  if (
    stages.some((stage) =>
      stage.includes("production")
    )
  ) {
    return "production-aware";
  }

  if (
    stages.some((stage) =>
      stage.includes("comparison")
    )
  ) {
    return "evaluating-material-options";
  }

  return "early-learning";
}

function getJourneyIntensity(events = []) {
  const total = events.length;

  if (total >= 15) return "high";
  if (total >= 7) return "moderate";
  if (total >= 3) return "light";

  return "minimal";
}

function getQuoteIntentStrength(events = []) {
  const quoteEvents = events.filter((event) =>
    [
      "article_quote_click",
      "knowledge_quote_click",
      "article_quote_submit"
    ].includes(event.event_type)
  ).length;

  if (quoteEvents >= 3) return "elevated";
  if (quoteEvents >= 1) return "emerging";

  return "informational";
}

export function getBuyerJourneyIntelligence() {
  const events = readBuyerIntentEvents();
  const repeatedConcernFamilies =
    getRepeatedConcernFamilies(events);
  const weightedIntentScore =
    calculateWeightedIntentScore(
      events,
      repeatedConcernFamilies
    );

  return {
    sourcingTrajectory: getSourcingTrajectory(events),
    operationalThemes: getOperationalThemes(events),
    repeatedConcernFamilies,
    journeyIntensity:
      getJourneyIntensity(events),
    quoteIntentStrength:
      getQuoteIntentStrength(events),
    weightedIntentScore,
    weightedIntentTier:
      getWeightedIntentTier(weightedIntentScore),
    totalTrackedEvents: events.length
  };
}

export function buildBuyerIntentNote(article) {
  if (!article?.seoSlug) return "";

  const matchingEvents = readBuyerIntentEvents().filter(
    (event) =>
      event.article_slug === article.seoSlug
  );

  const quoteClicks = matchingEvents.filter(
    (event) =>
      event.event_type ===
      "article_quote_click"
  ).length;

  const journey =
    getBuyerJourneyIntelligence();

  return [
    "Prime intent:",
    article.articleName,
    `slug=${article.seoSlug}`,
    `usage=${article.usageSegment || "unknown"}`,
    `quote_clicks=${quoteClicks}`,
    `journey=${journey.sourcingTrajectory}`,
    `journey_intensity=${journey.journeyIntensity}`,
    `quote_intent=${journey.quoteIntentStrength}`,
    `weighted_intent=${journey.weightedIntentTier}`
  ].join(" ");
}
