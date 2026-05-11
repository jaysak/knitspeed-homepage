const HIGH_PRESSURE_MONTHS = [10, 11, 12]
const POST_HOLIDAY_MONTHS = [1, 2]

export function getSeasonalProductionPressure(date = new Date()) {
  const month = date.getMonth() + 1

  if (HIGH_PRESSURE_MONTHS.includes(month)) {
    return {
      level: "high",
      weight: 8,
      reason: "Peak seasonal production pressure"
    }
  }

  if (POST_HOLIDAY_MONTHS.includes(month)) {
    return {
      level: "moderate",
      weight: 5,
      reason: "Post-holiday production normalization"
    }
  }

  return {
    level: "normal",
    weight: 2,
    reason: "Normal production window"
  }
}

export function getDyeingComplexityScore(page = {}) {
  let score = 0
  const tags = page.tags || []
  const title = (page.title || "").toLowerCase()

  if (tags.includes("dyeing")) score += 3
  if (tags.includes("reactive dyeing")) score += 3
  if (title.includes("dark")) score += 2
  if (title.includes("single jersey")) score += 2
  if (title.includes("compact")) score += 1
  if (title.includes("shrinkage")) score += 1

  return {
    score,
    level:
      score >= 7
        ? "high"
        : score >= 4
        ? "moderate"
        : "normal"
  }
}

export function getSourcingVolatilitySignal(page = {}) {
  const text = JSON.stringify(page).toLowerCase()

  let volatility = 0

  if (text.includes("dark shade")) volatility += 2
  if (text.includes("reactive")) volatility += 2
  if (text.includes("shrinkage")) volatility += 1
  if (text.includes("lab dip")) volatility += 2
  if (text.includes("colorfastness")) volatility += 2

  return {
    volatility,
    level:
      volatility >= 6
        ? "elevated"
        : volatility >= 3
        ? "moderate"
        : "stable"
  }
}

export function getProductionReadinessSignal(page = {}) {
  let readiness = 10

  if (!page.guidance || page.guidance.length === 0) readiness -= 2
  if (!page.faqs || page.faqs.length === 0) readiness -= 2
  if (!page.tags || page.tags.length < 3) readiness -= 1
  if (!page.sections || page.sections.length < 2) readiness -= 2

  return {
    readiness,
    level:
      readiness >= 8
        ? "high"
        : readiness >= 5
        ? "moderate"
        : "low"
  }
}

export function getTemporalManufacturingSignals(page = {}) {
  return {
    seasonalPressure: getSeasonalProductionPressure(),
    dyeingComplexity: getDyeingComplexityScore(page),
    sourcingVolatility: getSourcingVolatilitySignal(page),
    productionReadiness: getProductionReadinessSignal(page)
  }
}
