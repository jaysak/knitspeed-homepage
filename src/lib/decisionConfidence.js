export function getDecisionConfidence(article = {}) {
  const name = (article.article_name || article.name || "").toLowerCase()
  const slug = (article.article_slug || article.slug || "").toLowerCase()

  const guidance = {
    bestFor: "General knitted apparel sourcing",
    sourcingFit: "Balanced commercial flexibility",
    buyerPerspective: "Often selected when buyers want versatile fabric options.",
    comparisonHint: "Usually compared against other everyday cotton knits.",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    guidance.bestFor = "Soft everyday T-shirt programs"
    guidance.sourcingFit = "Breathability and daily wear comfort"
    guidance.buyerPerspective =
      "Often chosen for soft retail basics and relaxed cotton apparel."
    guidance.comparisonHint =
      "Usually compared against interlock for softness versus structure."
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    guidance.bestFor = "More structured knit apparel"
    guidance.sourcingFit = "Cleaner body and elevated garment structure"
    guidance.buyerPerspective =
      "Often selected when buyers want a smoother and more stable knit feel."
    guidance.comparisonHint =
      "Usually compared against single jersey for structure versus drape."
  }

  if (name.includes("compact")) {
    guidance.sourcingFit = "Cleaner surface and premium visual finish"
  }

  if (name.includes("rib")) {
    guidance.bestFor = "Stretch-focused trims and garment areas"
  }

  return guidance
}
