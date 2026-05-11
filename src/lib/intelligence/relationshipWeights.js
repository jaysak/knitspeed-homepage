export const RELATIONSHIP_WEIGHTS = {
  "yarn-to-structure": {
    weight: 0.95,
    importance: "critical"
  },

  "structure-to-dyeing": {
    weight: 0.92,
    importance: "critical"
  },

  "gsm-to-handfeel": {
    weight: 0.84,
    importance: "high"
  },

  "supplier-to-consistency": {
    weight: 0.97,
    importance: "critical"
  },

  "structure-to-shrinkage": {
    weight: 0.88,
    importance: "high"
  },

  "fabric-to-repeatability": {
    weight: 0.91,
    importance: "critical"
  },

  "buyer-intent-to-quote": {
    weight: 0.82,
    importance: "high"
  },

  "season-to-production-pressure": {
    weight: 0.89,
    importance: "high"
  }
};

export function getRelationshipWeight(key) {
  return RELATIONSHIP_WEIGHTS[key] || null;
}

export function calculateRelationshipStrength(weights = []) {
  if (!weights.length) return 0;

  const total = weights.reduce((sum, item) => {
    return sum + (item.weight || 0);
  }, 0);

  return Number((total / weights.length).toFixed(2));
}

export const BUYER_INTENT_EVENT_WEIGHTS = {
  article_impression: 0.2,
  knowledge_article_view: 0.35,
  article_quote_click: 0.75,
  knowledge_quote_click: 0.8,
  article_quote_submit: 1
};

export const OPERATIONAL_CONCERN_WEIGHTS = {
  "dimensional stability": 0.95,
  "shade consistency": 0.88,
  "print behavior": 0.82,
  "garment yield": 0.9
};

export function getBuyerIntentEventWeight(eventType) {
  return BUYER_INTENT_EVENT_WEIGHTS[eventType] || 0.1;
}

export function getOperationalConcernWeight(concern) {
  return OPERATIONAL_CONCERN_WEIGHTS[concern] || 0.4;
}

export function calculateWeightedIntentScore(events = [], concerns = []) {
  const eventScore = events.reduce((sum, event) => {
    const baseWeight =
      getBuyerIntentEventWeight(event.event_type);

    const temporalMultiplier =
      getTemporalSignalMultiplier(
        event.created_at
      );

    return sum + (baseWeight * temporalMultiplier);
  }, 0);

  const concernScore = concerns.reduce((sum, concern) => {
    return sum + getOperationalConcernWeight(concern);
  }, 0);

  return Number((eventScore + concernScore).toFixed(2));
}

export function getWeightedIntentTier(score = 0) {
  if (score >= 8) return "strong";
  if (score >= 4) return "developing";
  if (score >= 1.5) return "emerging";

  return "light";
}


export function getTemporalSignalMultiplier(createdAt) {
  if (!createdAt) return 0.4;

  const created = new Date(createdAt).getTime();

  if (Number.isNaN(created)) {
    return 0.4;
  }

  const now = Date.now();
  const ageDays =
    (now - created) / (1000 * 60 * 60 * 24);

  if (ageDays <= 1) return 1;
  if (ageDays <= 7) return 0.92;
  if (ageDays <= 30) return 0.72;
  if (ageDays <= 90) return 0.5;

  return 0.3;
}
