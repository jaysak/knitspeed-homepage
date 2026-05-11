import { OPERATIONAL_CONTEXT_SIGNALS } from "../../data/operations/operationalContextSignals";

export function getOperationalContextSignals() {
  return OPERATIONAL_CONTEXT_SIGNALS;
}

export function getOperationalContextForPage(page = {}) {
  const searchText = JSON.stringify(page).toLowerCase();

  return OPERATIONAL_CONTEXT_SIGNALS.filter((signal) => {
    const affectedMatch = signal.affectedAreas.some((area) =>
      searchText.includes(area.toLowerCase())
    );

    const labelMatch = searchText.includes(signal.label.toLowerCase());

    return affectedMatch || labelMatch;
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
