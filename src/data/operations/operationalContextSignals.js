export const OPERATIONAL_CONTEXT_SIGNALS = [
  {
    id: "cotton-price-volatility",
    signalType: "market_input",
    label: "Cotton price volatility",
    severity: "moderate",
    affectedAreas: ["cotton yarn", "cotton knit fabric", "quotation timing"],
    sourcingImpact:
      "Cotton price movement can affect yarn quotation stability and fabric pricing windows.",
    buyerImplication:
      "Buyers may need faster quote confirmation when cotton input prices are moving."
  },
  {
    id: "dark-reactive-shade-pressure",
    signalType: "dyeing_process",
    label: "Dark reactive shade production pressure",
    severity: "elevated",
    affectedAreas: ["dyeing", "colorfastness", "lead time"],
    sourcingImpact:
      "Dark reactive shades often require stronger washing, shade control, and colorfastness attention.",
    buyerImplication:
      "Dark color programs may need more realistic lead time and clearer approval standards."
  },
  {
    id: "seasonal-production-pressure",
    signalType: "seasonal_capacity",
    label: "Seasonal production pressure",
    severity: "moderate",
    affectedAreas: ["knitting", "dyeing", "finishing", "delivery"],
    sourcingImpact:
      "Seasonal demand can increase queue pressure across knitting, dyeing, and finishing.",
    buyerImplication:
      "Buyers should confirm target delivery windows early during higher-pressure periods."
  },
  {
    id: "finishing-stability-sensitivity",
    signalType: "finishing_process",
    label: "Finishing stability sensitivity",
    severity: "normal",
    affectedAreas: ["shrinkage", "width", "GSM", "hand feel"],
    sourcingImpact:
      "Finishing choices can affect dimensional stability, width, GSM, surface appearance, and hand feel.",
    buyerImplication:
      "Finished fabric expectations should be discussed before bulk approval."
  }
];
