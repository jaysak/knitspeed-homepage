function includesAny(values = [], targets = []) {
  const set = new Set(values || []);

  return targets.some((target) => set.has(target));
}

function getStabilityConcerns(page = {}) {
  const concerns = [];

  const processFamilies = page.processFamilies || [];
  const riskSignals = page.riskSignals || [];
  const yarnFamilies = page.yarnFamilies || [];

  if (
    includesAny(processFamilies, ["dyeing", "finishing"])
  ) {
    concerns.push(
      "Production consistency may depend on stable dyeing and finishing coordination."
    );
  }

  if (
    includesAny(riskSignals, [
      "shade-consistency",
      "dimensional-stability"
    ])
  ) {
    concerns.push(
      "Fabric approval processes may require tighter repeatability control between sampling and bulk production."
    );
  }

  if (
    includesAny(yarnFamilies, [
      "compact-cotton",
      "combed-cotton"
    ])
  ) {
    concerns.push(
      "Yarn sourcing consistency may influence final fabric hand feel and production repeatability."
    );
  }

  return concerns;
}

export function getSourcingStabilityInference(page = {}) {
  const concerns = getStabilityConcerns(page);

  let stabilityLevel = "stable";

  if (concerns.length >= 3) {
    stabilityLevel = "sensitive";
  } else if (concerns.length >= 1) {
    stabilityLevel = "moderate";
  }

  return {
    stabilityLevel,
    concerns
  };
}
