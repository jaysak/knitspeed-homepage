export function getVisualPlaceholder(article = {}) {
  const name = (article.article_name || article.name || "").toLowerCase()
  const slug = (article.article_slug || article.slug || "").toLowerCase()

  const placeholder = {
    label: "Fabric Visualization Zone",
    mood: "Balanced textile structure",
    texture: "Commercial knit surface",
    gradient: "from-slate-100 via-slate-50 to-white",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    placeholder.label = "Soft Drape Visualization"
    placeholder.mood = "Relaxed breathable movement"
    placeholder.texture = "Lightweight casual knit surface"
    placeholder.gradient = "from-blue-50 via-slate-50 to-white"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    placeholder.label = "Structured Knit Visualization"
    placeholder.mood = "Cleaner and more stable body"
    placeholder.texture = "Smoother premium knit surface"
    placeholder.gradient = "from-emerald-50 via-slate-50 to-white"
  }

  if (name.includes("rib")) {
    placeholder.label = "Stretch Recovery Visualization"
    placeholder.texture = "Flexible rib structure"
  }

  if (name.includes("compact")) {
    placeholder.texture = "Cleaner premium cotton appearance"
  }

  return placeholder
}
