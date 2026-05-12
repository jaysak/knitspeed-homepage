export function getVisualGuidance(article = {}) {
  const name = (article.articleName || article.article_name || article.name || "").toLowerCase()
  const slug = (article.seoSlug || article.article_slug || article.slug || "").toLowerCase()

  const guidance = {
    silhouette: "Everyday Apparel",
    fabricMood: "Balanced daily-wear knit",
    visualTone: "Soft and commercially versatile",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    guidance.silhouette = "T-Shirts and Casualwear"
    guidance.fabricMood = "Soft breathable drape"
    guidance.visualTone = "Relaxed everyday cotton feel"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    guidance.silhouette = "Structured Knit Apparel"
    guidance.fabricMood = "Cleaner and more stable body"
    guidance.visualTone = "Premium retail structure"
  }

  if (name.includes("rib")) {
    guidance.silhouette = "Collars, Cuffs, Stretch Areas"
    guidance.fabricMood = "Flexible stretch recovery"
  }

  if (name.includes("compact")) {
    guidance.visualTone = "Cleaner premium surface appearance"
  }

  return guidance
}
