function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

function unique(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function getContinuityFocusAreas(page = {}, context = {}) {
  const areas = [];

  if (
    includesAny(page.processFamilies, ["dyeing"])
  ) {
    areas.push("shade consistency continuity");
  }

  if (
    includesAny(page.processFamilies, ["finishing"])
  ) {
    areas.push("finishing repeatability");
  }

  if (
    includesAny(page.riskSignals, [
      "dimensional-stability",
      "shrinkage-risk"
    ])
  ) {
    areas.push("wash-result continuity");
  }

  if (
    context?.sourcingStability?.stabilityLevel === "sensitive"
  ) {
    areas.push("sample-to-bulk alignment");
  }

  if (
    context?.buyerIntentProgression?.samplingLikelihood === "high"
  ) {
    areas.push("sampling continuity");
  }

  return unique(areas);
}

function getCoordinationPriorities(page = {}, context = {}) {
  const priorities = [];

  if (
    context?.urgency?.urgencyLevel === "elevated"
  ) {
    priorities.push("timeline coordination");
  }

  if (
    includesAny(page.processFamilies, ["dyeing", "finishing"])
  ) {
    priorities.push("production process coordination");
  }

  if (
    context?.quotePreparation?.readinessLevel === "needs-alignment"
  ) {
    priorities.push("pre-production expectation alignment");
  }

  return unique(priorities);
}

export function getSourcingContinuityMemory(page = {}, context = {}) {
  return {
    continuityFocusAreas: getContinuityFocusAreas(page, context),
    coordinationPriorities: getCoordinationPriorities(page, context)
  };
}
