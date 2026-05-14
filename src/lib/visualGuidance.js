export function getVisualGuidance(article = {}) {
  const name = (article.articleName || article.article_name || article.name || "").toLowerCase()
  const slug = (article.seoSlug || article.article_slug || article.slug || "").toLowerCase()

  const guidance = {
    silhouette: "Everyday Apparel",
    fabricMood: "Balanced daily-wear knit",
    visualTone: "Soft and commercially versatile",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    guidance.silhouette = "เสื้อยืดและงานลำลอง"
    guidance.fabricMood = "สัมผัสนุ่ม ระบายอากาศดี"
    guidance.visualTone = "ลุคคอตตอนสบายสำหรับใส่ประจำวัน"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    guidance.silhouette = "งานผ้าถักที่ต้องการทรงชัด"
    guidance.fabricMood = "ทรงผ้าดูนิ่งและเรียบร้อยขึ้น"
    guidance.visualTone = "ลุคพรีเมียมสำหรับงานรีเทล"
  }

  if (name.includes("rib")) {
    guidance.silhouette = "ปก แขน และส่วนที่ต้องการความยืดหยุ่น"
    guidance.fabricMood = "ยืดหยุ่นและคืนตัวได้ดี"
  }

  if (name.includes("compact")) {
    guidance.visualTone = "ผิวผ้าเรียบและดูพรีเมียม"
  }

  return guidance
}
