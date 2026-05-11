const SEASONAL_PRESSURE_MONTHS = [2, 3, 4, 8, 9, 10];

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function hasHighSensitivity(page = {}) {
  return (
    (page.riskSignals || []).includes("dimensional-stability") ||
    (page.riskSignals || []).includes("shade-consistency") ||
    (page.riskSignals || []).includes("shrinkage-risk")
  );
}

function hasOperationalComplexity(page = {}) {
  return (
    (page.processFamilies || []).includes("dyeing") ||
    (page.processFamilies || []).includes("finishing")
  );
}

export function getQuoteUrgencyInference(page = {}) {
  const month = getCurrentMonth();

  const seasonalPressure =
    SEASONAL_PRESSURE_MONTHS.includes(month);

  const operationalComplexity =
    hasOperationalComplexity(page);

  const highSensitivity =
    hasHighSensitivity(page);

  const urgencyFactors = [];

  if (seasonalPressure) {
    urgencyFactors.push(
      "Seasonal manufacturing pressure may increase sampling and dyeing coordination timelines."
    );
  }

  if (operationalComplexity) {
    urgencyFactors.push(
      "Production processes involving dyeing or finishing may require earlier technical alignment before bulk production."
    );
  }

  if (highSensitivity) {
    urgencyFactors.push(
      "Dimensional stability and production-sensitive fabrics may benefit from earlier wash-test and approval discussions."
    );
  }

  const urgencyLevel =
    urgencyFactors.length >= 3
      ? "elevated"
      : urgencyFactors.length >= 1
        ? "moderate"
        : "normal";

  return {
    urgencyLevel,
    urgencyFactors,
    operationalComplexity,
    highSensitivity,
    seasonalPressure
  };
}
