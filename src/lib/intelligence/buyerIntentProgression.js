function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

function inferEducationStage(page = {}) {
  if (
    includesAny(page.processFamilies, ["dyeing", "finishing"]) ||
    includesAny(page.riskSignals, ["shade-consistency", "dimensional-stability"])
  ) {
    return "production-aware";
  }

  if (
    includesAny(page.yarnFamilies, ["compact-cotton", "combed-cotton"]) ||
    includesAny(page.fabricFamilies, ["single-jersey", "interlock"])
  ) {
    return "material-comparison";
  }

  return "early-research";
}

function inferSourcingReadiness(page = {}) {
  const buyerStage = page.buyerJourneyStage || "";

  if (
    buyerStage.includes("production") ||
    buyerStage.includes("sourcing") ||
    includesAny(page.riskSignals, ["shrinkage-risk", "shade-consistency"])
  ) {
    return "near-sourcing";
  }

  if (
    buyerStage.includes("comparison") ||
    buyerStage.includes("specification")
  ) {
    return "evaluating-options";
  }

  return "learning";
}

function inferSamplingLikelihood(page = {}) {
  if (
    includesAny(page.processFamilies, ["dyeing", "finishing"]) ||
    includesAny(page.riskSignals, ["dimensional-stability", "shade-consistency", "shrinkage-risk"])
  ) {
    return "high";
  }

  if (
    includesAny(page.topicCluster ? [page.topicCluster] : [], [
      "fabric-specification",
      "fabric-behavior",
      "production-behavior"
    ])
  ) {
    return "moderate";
  }

  return "low";
}

export function getBuyerIntentProgression(page = {}) {
  return {
    educationStage: inferEducationStage(page),
    sourcingReadiness: inferSourcingReadiness(page),
    samplingLikelihood: inferSamplingLikelihood(page)
  };
}
