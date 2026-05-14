const normalize = (value = "") => value.toLowerCase()

export function getComparativeReasoning(article = {}) {
  const name = normalize(article.articleName || article.article_name || article.name || "")
  const slug = normalize(article.seoSlug || article.article_slug || article.slug || "")

  const is20s = name.includes("20") || slug.includes("20")
  const is30s = name.includes("30") || slug.includes("30")
  const is40s = name.includes("40") || slug.includes("40")

  const reasoning = {
    compareAgainst: "ผ้าถักในกลุ่มใกล้เคียง",
    softerSide: "สัมผัสนุ่มสมดุล เหมาะกับงานทั่วไป",
    structuredSide: "โครงสร้างสมดุล เหมาะกับงานเชิงพาณิชย์",
    sourcingTradeoff:
      "ผู้ซื้อมักพิจารณาสมดุลระหว่างความนุ่ม ความอยู่ทรง และผลลัพธ์หลังผลิต",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    reasoning.compareAgainst = "Interlock"
    reasoning.softerSide = "ทิ้งตัวนุ่ม น้ำหนักเบา ใส่สบาย"
    reasoning.structuredSide = "ทรงผ้านุ่มกว่า Interlock"
    reasoning.sourcingTradeoff =
      "เหมาะกับงานที่เน้นความสบายและการระบายอากาศมากกว่าความแข็งของโครงสร้าง"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    reasoning.compareAgainst = "Single Jersey"
    reasoning.softerSide = "ผิวผ้าเรียบและสัมผัสดูสะอาด"
    reasoning.structuredSide = "ทรงผ้าคงรูปและดูพรีเมียมมากขึ้น"
    reasoning.sourcingTradeoff =
      "เหมาะกับงานที่ต้องการความอยู่ทรงและลุคที่ดูเรียบร้อยกว่า"
  }

  if (is20s) {
    reasoning.softerSide = "เนื้อผ้าแน่นและให้ความทึบมากกว่า"
    reasoning.structuredSide = "เหมาะกับงาน Oversized และเสื้อทรงหนัก"
    reasoning.sourcingTradeoff =
      "เหมาะกับงานที่ต้องการความอยู่ทรง งานสกรีน และภาพลักษณ์ที่ดูหนักแน่น"
  }

  if (is30s) {
    reasoning.softerSide = "สมดุลระหว่างน้ำหนักและความนุ่ม"
    reasoning.structuredSide = "ใช้งานได้หลากหลายสำหรับตลาดรีเทล"
  }

  if (is40s) {
    reasoning.softerSide = "สัมผัสละเอียด เบา และดูพรีเมียมกว่า"
    reasoning.structuredSide = "เหมาะกับงานที่ต้องการผิวผ้าเรียบและลุคสะอาด"
    reasoning.sourcingTradeoff =
      "เหมาะกับแบรนด์ที่ต้องการความสบายและภาพลักษณ์พรีเมียมมากกว่าความหนักของเนื้อผ้า"
  }

  return reasoning
}
