export function getComparativeReasoning(article = {}) {
  const name = (article.articleName || article.article_name || article.name || "").toLowerCase()
  const slug = (article.seoSlug || article.article_slug || article.slug || "").toLowerCase()

  const reasoning = {
    compareAgainst: "Other versatile knitted fabrics",
    softerSide: "Balanced everyday softness",
    structuredSide: "Balanced commercial structure",
    sourcingTradeoff:
      "Buyers often balance softness, stability, and garment outcome expectations.",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    reasoning.compareAgainst = "Interlock fabrics"
    reasoning.softerSide = "Softer drape and lighter everyday feel"
    reasoning.structuredSide = "Less structured than interlock"
    reasoning.sourcingTradeoff =
      "Often chosen when comfort, breathability, and relaxed silhouettes matter more than structure."
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    reasoning.compareAgainst = "Single jersey fabrics"
    reasoning.softerSide = "Cleaner and smoother surface feel"
    reasoning.structuredSide = "More stable body and premium structure"
    reasoning.sourcingTradeoff =
      "Often selected when buyers want a more elevated garment shape and stability."
  }

  if (name.includes("rib")) {
    reasoning.compareAgainst = "Single jersey trims"
    reasoning.structuredSide = "Higher stretch recovery behavior"
  }

  return reasoning
}
