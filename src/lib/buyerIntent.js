const BUYER_INTENT_STORAGE_KEY = "knitspeed_buyer_intent_events";
const MAX_BUYER_INTENT_EVENTS = 100;

export function readBuyerIntentEvents() {
  try {
    return JSON.parse(localStorage.getItem(BUYER_INTENT_STORAGE_KEY) || "[]");
  } catch (error) {
    console.warn("Could not read buyer intent events:", error);
    return [];
  }
}

export function writeBuyerIntentEvent(eventType, article, details = {}) {
  if (!article?.seoSlug) return null;

  const event = {
    event_type: eventType,
    article_name: article.articleName,
    article_slug: article.seoSlug,
    usage_segment: article.usageSegment,
    material_family: article.materialFamily,
    fabric_structure: article.fabricStructure,
    linked_products: article.linkedProducts,
    created_at: new Date().toISOString(),
    ...details,
  };

  const events = readBuyerIntentEvents();
  events.push(event);
  localStorage.setItem(
    BUYER_INTENT_STORAGE_KEY,
    JSON.stringify(events.slice(-MAX_BUYER_INTENT_EVENTS))
  );

  return event;
}

export function buildBuyerIntentNote(article) {
  if (!article?.seoSlug) return "";

  const matchingEvents = readBuyerIntentEvents().filter(
    (event) => event.article_slug === article.seoSlug
  );
  const quoteClicks = matchingEvents.filter(
    (event) => event.event_type === "article_quote_click"
  ).length;

  return [
    "Prime intent:",
    article.articleName,
    `slug=${article.seoSlug}`,
    `usage=${article.usageSegment || "unknown"}`,
    `quote_clicks=${quoteClicks}`,
  ].join(" ");
}
