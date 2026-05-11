function unique(items = []) {
  return Array.from(new Set(items.filter(Boolean)));
}

function hasItems(items = []) {
  return Array.isArray(items) && items.length > 0;
}

function getMissingDiscussionAreas(context = {}) {
  const missing = [];

  if (context?.urgency?.urgencyLevel !== "normal") {
    missing.push("timeline expectations");
  }

  if (context?.sourcingStability?.stabilityLevel !== "stable") {
    missing.push("sample-to-bulk repeatability");
  }

  if (hasItems(context?.recommendations?.recommendedSamplingFocus)) {
    missing.push("sampling confirmation");
  }

  if (hasItems(context?.recommendations?.recommendedOperationalChecks)) {
    missing.push("production checks");
  }

  return unique(missing);
}

function getPreparationFocus(context = {}) {
  const focus = [];

  if (context?.buyerIntentProgression?.sourcingReadiness === "near-sourcing") {
    focus.push("prepare buyer use case and production stage");
  }

  if (context?.buyerIntentProgression?.samplingLikelihood === "high") {
    focus.push("prepare sample expectations before quotation");
  }

  if (context?.sourcingStability?.stabilityLevel === "sensitive") {
    focus.push("prepare repeatability and approval requirements");
  }

  if (context?.urgency?.urgencyLevel === "elevated") {
    focus.push("prepare timeline and delivery constraints");
  }

  return unique(focus);
}

export function getQuotePreparationIntelligence(context = {}) {
  const missingDiscussionAreas = getMissingDiscussionAreas(context);
  const preparationFocus = getPreparationFocus(context);

  const readinessLevel =
    missingDiscussionAreas.length >= 3
      ? "needs-alignment"
      : missingDiscussionAreas.length >= 1
        ? "partially-ready"
        : "ready";

  return {
    readinessLevel,
    missingDiscussionAreas,
    preparationFocus
  };
}
