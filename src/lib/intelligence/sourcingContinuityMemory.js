function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

function unique(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function getContinuityFocusAreas(page = {}, context = {}) {
  const areas = [];

  if (includesAny(page.processFamilies, ["dyeing"])) {
    areas.push("shade consistency continuity");
  }

  if (includesAny(page.processFamilies, ["finishing"])) {
    areas.push("finishing repeatability");
  }

  if (
    includesAny(page.riskSignals, [
      "dimensional-stability",
      "shrinkage-risk",
      "wash behavior",
      "wash-behavior"
    ])
  ) {
    areas.push("wash-result continuity");
  }

  if (
    includesAny(page.processFamilies, ["printing", "screen printing", "heat transfer"]) ||
    includesAny(page.riskSignals, [
      "print cracking",
      "print stiffness",
      "surface peeling",
      "surface aging",
      "heavy coverage",
      "reduced airflow"
    ])
  ) {
    areas.push("decoration outcome continuity");
  }

  if (
    includesAny(page.processFamilies, ["cutting", "garment production"]) ||
    includesAny(page.riskSignals, ["yield-sensitivity", "consumption-variation"])
  ) {
    areas.push("garment production continuity");
  }

  if (context?.sourcingStability?.stabilityLevel === "sensitive") {
    areas.push("sample-to-bulk alignment");
  }

  if (context?.buyerIntentProgression?.samplingLikelihood === "high") {
    areas.push("sampling continuity");
  }

  return unique(areas);
}

function getCoordinationPriorities(page = {}, context = {}) {
  const priorities = [];

  if (context?.urgency?.urgencyLevel === "elevated") {
    priorities.push("timeline coordination");
  }

  if (includesAny(page.processFamilies, ["dyeing", "finishing"])) {
    priorities.push("production process coordination");
  }

  if (
    includesAny(page.processFamilies, ["printing", "screen printing", "heat transfer"])
  ) {
    priorities.push("decoration process coordination");
  }

  if (
    includesAny(page.processFamilies, ["cutting", "garment production"])
  ) {
    priorities.push("garment production coordination");
  }

  if (context?.quotePreparation?.readinessLevel === "needs-alignment") {
    priorities.push("pre-production expectation alignment");
  }

  return unique(priorities);
}

function getConcernPattern(page = {}, context = {}) {
  const concerns = [];

  if (
    includesAny(page.riskSignals, [
      "dimensional-stability",
      "shrinkage-risk",
      "wash behavior",
      "wash-behavior"
    ])
  ) {
    concerns.push("dimensional and wash stability");
  }

  if (
    includesAny(page.riskSignals, [
      "shade-consistency",
      "shade variation",
      "surface inconsistency"
    ]) ||
    includesAny(page.processFamilies, ["dyeing"])
  ) {
    concerns.push("shade and color consistency");
  }

  if (
    includesAny(page.riskSignals, [
      "print cracking",
      "print stiffness",
      "surface peeling",
      "surface aging",
      "reduced airflow",
      "heavy coverage"
    ])
  ) {
    concerns.push("decoration durability and comfort");
  }

  if (
    includesAny(page.riskSignals, [
      "yield-sensitivity",
      "consumption-variation",
      "marker-efficiency"
    ])
  ) {
    concerns.push("costing and garment yield");
  }

  if (context?.quotePreparation?.readinessLevel === "needs-alignment") {
    concerns.push("pre-production alignment");
  }

  return unique(concerns);
}

function getContinuityIntensity(continuityFocusAreas = [], coordinationPriorities = []) {
  const total = continuityFocusAreas.length + coordinationPriorities.length;

  if (total >= 5) return "high";
  if (total >= 3) return "moderate";
  if (total >= 1) return "light";

  return "none";
}

function getProcurementReadiness(context = {}, concernPattern = []) {
  if (
    context?.quotePreparation?.readinessLevel === "needs-alignment" ||
    concernPattern.length >= 3
  ) {
    return "needs-operational-alignment";
  }

  if (
    context?.buyerIntentProgression?.sourcingReadiness === "near-sourcing" ||
    context?.quotePreparation?.readinessLevel === "partially-ready"
  ) {
    return "preparing-for-sourcing";
  }

  return "early-learning";
}

export function getSourcingContinuityMemory(page = {}, context = {}) {
  const continuityFocusAreas = getContinuityFocusAreas(page, context);
  const coordinationPriorities = getCoordinationPriorities(page, context);
  const concernPattern = getConcernPattern(page, context);

  return {
    continuityFocusAreas,
    coordinationPriorities,
    concernPattern,
    continuityIntensity: getContinuityIntensity(
      continuityFocusAreas,
      coordinationPriorities
    ),
    procurementReadiness: getProcurementReadiness(context, concernPattern)
  };
}
