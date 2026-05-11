import { OPERATIONAL_CONTEXT_SIGNALS } from "../../data/operations/operationalContextSignals";

export function getOperationalContextSignals() {
  return OPERATIONAL_CONTEXT_SIGNALS;
}

export function getOperationalContextForPage(page = {}) {
  const searchText = JSON.stringify(page).toLowerCase();
  const tags = page.tags || [];
  const cluster = page.topicCluster || "";

  return OPERATIONAL_CONTEXT_SIGNALS.filter((signal) => {
    if (
      signal.id === "dark-reactive-shade-pressure" &&
      (
        tags.includes("dyeing") ||
        tags.includes("reactive dyeing") ||
        searchText.includes("dark shade") ||
        cluster.toLowerCase().includes("dye")
      )
    ) {
      return true;
    }

    if (
      signal.id === "finishing-stability-sensitivity" &&
      (
        tags.includes("shrinkage") ||
        tags.includes("compacting") ||
        tags.includes("finishing") ||
        searchText.includes("gsm") ||
        searchText.includes("width")
      )
    ) {
      return true;
    }

    if (
      signal.id === "seasonal-production-pressure" &&
      (
        tags.includes("cotton") ||
        tags.includes("production") ||
        searchText.includes("lead time")
      )
    ) {
      return true;
    }

    if (
      signal.id === "cotton-price-volatility" &&
      (
        tags.includes("cotton") ||
        searchText.includes("quotation") ||
        searchText.includes("pricing")
      )
    ) {
      return true;
    }

    return false;
  });
}

export function getOperationalContextSeverityWeight(severity) {
  if (severity === "elevated") return 8;
  if (severity === "moderate") return 5;
  if (severity === "normal") return 2;
  return 1;
}

export function summarizeOperationalContext(signals = []) {
  if (!signals.length) {
    return {
      level: "stable",
      weight: 0,
      reasons: []
    };
  }

  const weight = signals.reduce(
    (total, signal) => total + getOperationalContextSeverityWeight(signal.severity),
    0
  );

  return {
    level: weight >= 12 ? "elevated" : weight >= 5 ? "moderate" : "stable",
    weight,
    reasons: signals.map((signal) => signal.label)
  };
}
