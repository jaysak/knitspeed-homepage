export function getGarmentOutcome(article = {}) {
  const name = (article.articleName || article.article_name || article.name || "").toLowerCase()
  const slug = (article.seoSlug || article.article_slug || article.slug || "").toLowerCase()

  const outcome = {
    garmentShape: "Balanced everyday garment structure",
    wearingExperience: "Comfort-focused knitted apparel feel",
    visualResult: "Commercially versatile appearance",
    productionEffect:
      "Fabric choice can influence garment drape, stability, and finishing behavior.",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    outcome.garmentShape = "Relaxed soft-drape silhouette"
    outcome.wearingExperience = "Breathable lightweight daily-wear comfort"
    outcome.visualResult = "Casual retail T-shirt appearance"
    outcome.productionEffect =
      "Often selected when softer movement and relaxed garment flow are preferred."
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    outcome.garmentShape = "Cleaner and more structured silhouette"
    outcome.wearingExperience = "Smoother and more substantial knit feel"
    outcome.visualResult = "More elevated retail surface appearance"
    outcome.productionEffect =
      "Often selected when garment stability and cleaner body structure matter more."
  }

  if (name.includes("rib")) {
    outcome.garmentShape = "Stretch-responsive garment areas"
    outcome.productionEffect =
      "Frequently used where stretch recovery and trim flexibility are important."
  }

  if (name.includes("compact")) {
    outcome.visualResult = "Cleaner premium cotton surface"
  }

  return outcome
}
