const SENSITIVITY_RULES = [
  {
    id: "dark-reactive-dyeing",
    weight: 9,
    label: "Dark reactive dyeing sensitivity",
    keywords: ["dark shade", "reactive dyeing", "colorfastness", "rubbing"]
  },
  {
    id: "shade-approval",
    weight: 8,
    label: "Shade approval sensitivity",
    keywords: ["lab dip", "bulk shade", "shade matching", "color standard"]
  },
  {
    id: "dimensional-stability",
    weight: 7,
    label: "Dimensional stability sensitivity",
    keywords: ["shrinkage", "compacting", "width", "gsm", "wash testing"]
  },
  {
    id: "finishing-dependency",
    weight: 6,
    label: "Finishing dependency",
    keywords: ["finishing", "softener", "stentering", "hand feel", "surface"]
  },
  {
    id: "knit-structure-behavior",
    weight: 6,
    label: "Knit structure behavior",
    keywords: ["single jersey", "spirality", "loop", "knitted fabric"]
  },
  {
    id: "cotton-input-variation",
    weight: 5,
    label: "Cotton input variation",
    keywords: ["cotton", "compact cotton", "combed cotton", "yarn"]
  }
];

export function getManufacturingSensitivity(page = {}) {
  const searchText = JSON.stringify(page).toLowerCase();

  const matchedRules = SENSITIVITY_RULES.filter((rule) =>
    rule.keywords.some((keyword) => searchText.includes(keyword))
  );

  const rawScore = matchedRules.reduce((total, rule) => total + rule.weight, 0);
  const score = Math.min(rawScore, 30);

  return {
    score,
    level:
      score >= 22
        ? "high"
        : score >= 12
        ? "moderate"
        : score > 0
        ? "low"
        : "stable",
    reasons: matchedRules.map((rule) => rule.label)
  };
}
