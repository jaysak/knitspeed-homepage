export const PRODUCTION_MEMORY = {
  "single-jersey": {
    machineSensitivity: "medium",
    shrinkageRisk: "medium",
    dyeConsistency: "stable",
    seasonalPressure: "medium",
    reorderStability: "high",
    sourcingComplexity: "low",
    commonIssues: [
      "spirality",
      "width tolerance drift",
      "lightweight opacity variation"
    ],
    productionNotes: [
      "Monitor compact yarn consistency during repeat dye lots",
      "Check width behavior after finishing",
      "Validate shrinkage against target GSM"
    ]
  },

  "interlock": {
    machineSensitivity: "medium-high",
    shrinkageRisk: "low-medium",
    dyeConsistency: "stable",
    seasonalPressure: "medium",
    reorderStability: "high",
    sourcingComplexity: "medium",
    commonIssues: [
      "heat retention variation",
      "heavier finishing response",
      "needle stability dependency"
    ],
    productionNotes: [
      "Confirm bulk handfeel consistency",
      "Monitor knitting density stability",
      "Validate finishing softness against approved sample"
    ]
  },

  "compact-cotton": {
    machineSensitivity: "medium",
    shrinkageRisk: "low",
    dyeConsistency: "high",
    seasonalPressure: "high",
    reorderStability: "high",
    sourcingComplexity: "medium-high",
    commonIssues: [
      "premium expectation mismatch",
      "shade continuity pressure",
      "higher yarn sensitivity"
    ],
    productionNotes: [
      "Use stable yarn sourcing routes",
      "Monitor premium shade consistency",
      "Align fabric feel with garment positioning"
    ]
  }
};

export function getProductionMemory(key) {
  if (!key) return null;

  return PRODUCTION_MEMORY[key] || null;
}
