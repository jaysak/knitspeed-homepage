const normalize = (value = "") => value.toLowerCase()

export function getProductIntelligence(article = {}) {
  const name = normalize(article.articleName || article.article_name || article.name || "")
  const slug = normalize(article.seoSlug || article.article_slug || article.slug || "")

  const useCases = new Set()
  const feelTraits = new Set()
  const productionNotes = new Set()
  let summary =
    "Commonly selected for versatile knitted apparel programs."

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    useCases.add("Premium T-Shirts")
    useCases.add("Everyday Basics")
    feelTraits.add("Breathable knit")
    productionNotes.add("Good for screen printing")
    summary =
      "Soft breathable knit suited to cotton T-shirts and retail basics."
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    useCases.add("Structured Knitwear")
    feelTraits.add("More stable structure")
    productionNotes.add("Often selected for premium programs")
    summary =
      "Smoother, more stable knit structure for elevated apparel programs."
  }

  if (name.includes("compact")) {
    feelTraits.add("Smooth surface")
    productionNotes.add("Cleaner yarn appearance")
  }

  if (name.includes("combed")) {
    feelTraits.add("Soft hand feel")
    productionNotes.add("Common for premium cotton programs")
  }

  if (name.includes("rib")) {
    useCases.add("Cuffs and Collar Applications")
    feelTraits.add("Flexible stretch structure")
  }

  if (name.includes("cvc")) {
    productionNotes.add("Balanced cotton-poly blend")
  }

  if (useCases.size === 0) {
    useCases.add("General Apparel Applications")
  }

  return {
    summary,
    useCases: [...useCases],
    feelTraits: [...feelTraits],
    productionNotes: [...productionNotes],
  }
}
