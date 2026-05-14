const normalize = (value = "") => value.toLowerCase()

export function getProductIntelligence(article = {}) {
  const name = normalize(article.articleName || article.article_name || article.name || "")
  const slug = normalize(article.seoSlug || article.article_slug || article.slug || "")

  const is20s = name.includes("20") || slug.includes("20")
  const is30s = name.includes("30") || slug.includes("30")
  const is40s = name.includes("40") || slug.includes("40")
  const isSemiCombed =
    name.includes("semi") ||
    name.includes("semicombed") ||
    name.includes("semi-combed") ||
    slug.includes("semi")
  const isCompact = name.includes("compact") || slug.includes("compact")
  const isCombed = name.includes("combed") || slug.includes("combed")

  const useCases = new Set()
  const feelTraits = new Set()
  const productionNotes = new Set()
  let summary = "เหมาะสำหรับงานเสื้อผ้าถักทั่วไปที่ต้องการความยืดหยุ่นในการเลือกใช้งาน"

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    useCases.add("เสื้อยืด")
    useCases.add("งานลำลอง")
    feelTraits.add("ระบายอากาศดี")
    productionNotes.add("รองรับงาน Screen Print")
    summary = "ผ้า Single Jersey ให้สัมผัสนุ่ม ระบายอากาศดี เหมาะกับเสื้อยืดและงานรีเทลพื้นฐาน"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    useCases.add("เสื้อผ้าที่ต้องการทรงชัด")
    feelTraits.add("โครงสร้างนิ่งกว่า")
    productionNotes.add("เหมาะกับงานพรีเมียม")
    summary = "ผ้า Interlock มีโครงสร้างนิ่ง ผิวเรียบ และให้ลุคพรีเมียมกว่างานผ้าถักทั่วไป"
  }

  if (name.includes("rib") || slug.includes("rib")) {
    useCases.add("ปก แขน และขอบเสื้อ")
    feelTraits.add("ยืดหยุ่นและคืนตัวดี")
    productionNotes.add("เหมาะกับส่วนประกอบที่ต้องการความกระชับ")
  }

  if (is20s) {
    feelTraits.add("เนื้อแน่นกว่า")
    productionNotes.add("เหมาะกับงาน Oversized และเสื้อทรงหนัก")
    summary = "ผ้าเบอร์ 20 ให้เนื้อผ้าที่แน่นและมีน้ำหนักมากขึ้น เหมาะกับเสื้อ Oversized ยูนิฟอร์ม หรือสินค้าที่ต้องการความอยู่ทรง"
  }

  if (is30s) {
    feelTraits.add("สมดุลสำหรับใส่ประจำวัน")
    productionNotes.add("เหมาะกับงานเสื้อยืดรีเทลทั่วไป")
    summary = "ผ้าเบอร์ 30 ให้สมดุลระหว่างความนุ่ม น้ำหนัก และการระบายอากาศ เหมาะกับเสื้อยืดรีเทลและงานใช้งานประจำวัน"
  }

  if (is40s) {
    feelTraits.add("สัมผัสเบาและละเอียดขึ้น")
    productionNotes.add("เหมาะกับงานที่ต้องการผิวผ้าเรียบและลุคพรีเมียม")
    summary = "ผ้าเบอร์ 40 ให้สัมผัสละเอียด เบา และผิวผ้าที่ดูเรียบ เหมาะกับงานพรีเมียมที่ต้องการความสบายและภาพลักษณ์สะอาด"
  }

  if (isCompact) {
    feelTraits.add("ผิวผ้าเรียบ ขนผ้าน้อย")
    productionNotes.add("ช่วยให้ลุคสินค้าดูสะอาดและพรีเมียมขึ้น")
  }

  if (isCombed && !isSemiCombed) {
    feelTraits.add("สัมผัสนุ่ม")
    productionNotes.add("เหมาะกับงาน Cotton คุณภาพดี")
  }

  if (isSemiCombed) {
    feelTraits.add("สัมผัสใช้งานง่าย")
    productionNotes.add("เหมาะกับงานเชิงพาณิชย์ที่ต้องการต้นทุนสมดุล")
  }

  if (name.includes("cvc") || slug.includes("cvc")) {
    useCases.add("ยูนิฟอร์มและงานเชิงพาณิชย์")
    feelTraits.add("ใส่สบายแต่ดูแลง่ายขึ้น")
    productionNotes.add("Cotton 60/40 Poly ช่วยสมดุลความสบาย ความคงรูป และต้นทุน")
    summary = "ผ้า CVC 60/40 ผสม Cotton และ Polyester เพื่อให้ใส่สบายขึ้นกว่าผ้าโพลีล้วน พร้อมความคงรูปและดูแลง่าย เหมาะกับยูนิฟอร์มและงานผลิตเชิงพาณิชย์"
  }

  if (useCases.size === 0) {
    useCases.add("งานเสื้อผ้าทั่วไป")
  }

  return {
    summary,
    useCases: [...useCases],
    feelTraits: [...feelTraits],
    productionNotes: [...productionNotes],
  }
}
