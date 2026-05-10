export function getTopCounts(items, limit = 5) {
  return Object.entries(
    items.reduce((acc, item) => {
      if (!item) return acc;
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export function scorePrimeLead(lead) {
  let score = 0;
  const reasons = [];

  const addPoints = (points, reason) => {
    score += points;
    reasons.push(reason);
  };

  const quantityValue = Number(lead.quantity_value) || 0;
  const monthlyUsageKg = Number(lead.monthly_usage_kg) || 0;
  const productionStage = String(lead.production_stage || "").toLowerCase();
  const buyerType = String(lead.buyer_type || "").toLowerCase();
  const usageType = String(lead.usage_type || "").toLowerCase();

  if ((lead.lead_priority || "random") === "prime") {
    addPoints(15, "Prime source");
  }

  if (lead.article_name || lead.article_slug) {
    addPoints(15, "Article intent");
  }

  if (quantityValue >= 150) {
    addPoints(15, "Large quote quantity");
  } else if (quantityValue >= 50) {
    addPoints(10, "Qualified quote quantity");
  } else if (quantityValue > 0) {
    addPoints(5, "Quantity provided");
  }

  if (monthlyUsageKg >= 500) {
    addPoints(20, "High monthly usage");
  } else if (monthlyUsageKg >= 200) {
    addPoints(15, "Recurring usage potential");
  } else if (monthlyUsageKg > 0) {
    addPoints(8, "Monthly usage provided");
  }

  if (["brand", "garment factory", "print shop"].includes(buyerType)) {
    addPoints(10, "Qualified buyer type");
  } else if (buyerType) {
    addPoints(5, "Buyer type provided");
  }

  if (productionStage === "production ready" || productionStage === "reorder") {
    addPoints(15, "Near-term production");
  } else if (productionStage === "sampling") {
    addPoints(8, "Sampling opportunity");
  } else if (productionStage) {
    addPoints(5, "Production stage provided");
  }

  if (lead.sourcing_pain_points) {
    addPoints(10, "Sourcing pain point");
  }

  if (usageType.includes("production") || usageType.includes("brand")) {
    addPoints(5, "Commercial usage");
  }

  const normalizedScore = Math.min(score, 100);

  if (normalizedScore >= 70) {
    return { score: normalizedScore, tier: "Hot", reasons };
  }

  if (normalizedScore >= 40) {
    return { score: normalizedScore, tier: "Warm", reasons };
  }

  return { score: normalizedScore, tier: "Watch", reasons };
}
