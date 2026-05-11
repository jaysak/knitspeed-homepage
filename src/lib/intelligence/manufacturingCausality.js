const CAUSALITY_BY_SIGNAL = {
  compactCotton: {
    label: "Compact cotton",
    causes: [
      "lower yarn hairiness",
      "smoother surface",
      "more stable premium hand feel",
    ],
    affects: [
      "surface appearance",
      "pilling sensitivity",
      "garment perception",
    ],
  },
  singleJersey: {
    label: "Single jersey",
    causes: [
      "lighter knit structure",
      "one-sided loop behavior",
      "higher curl and spirality sensitivity",
    ],
    affects: [
      "drape",
      "edge curling",
      "washing behavior",
    ],
  },
  interlock: {
    label: "Interlock",
    causes: [
      "double-knit structure",
      "more balanced fabric face",
      "higher dimensional stability potential",
    ],
    affects: [
      "body",
      "stability",
      "premium garment feel",
    ],
  },
  reactiveDyeing: {
    label: "Reactive dyeing",
    causes: [
      "cotton fiber dye reaction",
      "shade control dependency",
      "wash-off and finishing sensitivity",
    ],
    affects: [
      "shade consistency",
      "colorfastness",
      "bulk approval risk",
    ],
  },
  darkShade: {
    label: "Dark shade production",
    causes: [
      "higher dye concentration",
      "longer processing sensitivity",
      "greater shade approval pressure",
    ],
    affects: [
      "lab dip matching",
      "colorfastness",
      "production lead time",
    ],
  },
  compacting: {
    label: "Compacting",
    causes: [
      "mechanical shrinkage control",
      "fabric compression",
      "dimensional stabilization",
    ],
    affects: [
      "shrinkage behavior",
      "width stability",
      "garment measurement control",
    ],
  },
};

const SLUG_SIGNAL_MAP = {
  "what-is-compact-cotton": ["compactCotton"],
  "single-jersey-vs-interlock": ["singleJersey", "interlock"],
  "what-causes-spirality-in-knitted-fabric": ["singleJersey"],
  "reactive-dyeing-for-cotton-knits": ["reactiveDyeing"],
  "why-dark-shades-need-more-dyeing-control": ["darkShade", "reactiveDyeing"],
  "compacting-vs-stentering-for-cotton-knits": ["compacting"],
};

export function getManufacturingCausalitySignals(slug) {
  if (!slug) {
    return [];
  }

  const signalKeys = SLUG_SIGNAL_MAP[slug] || [];

  return signalKeys
    .map((key) => CAUSALITY_BY_SIGNAL[key])
    .filter(Boolean);
}

export function getManufacturingCausalitySummary(slug) {
  const signals = getManufacturingCausalitySignals(slug);

  if (signals.length === 0) {
    return null;
  }

  return {
    signalCount: signals.length,
    labels: signals.map((signal) => signal.label),
    affectedAreas: [...new Set(signals.flatMap((signal) => signal.affects))],
  };
}
