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
