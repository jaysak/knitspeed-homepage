const normalize = (value = "") => value.toLowerCase()

export function getGarmentOutcome(article = {}) {
  const name = normalize(article.articleName || article.article_name || article.name || "")
  const slug = normalize(article.seoSlug || article.article_slug || article.slug || "")

  const is20s = name.includes("20") || slug.includes("20")
  const is30s = name.includes("30") || slug.includes("30")
  const is40s = name.includes("40") || slug.includes("40")
  const isCompact = name.includes("compact") || slug.includes("compact")

  const outcome = {
    garmentShape: "ทรงผ้าสมดุลสำหรับงานเสื้อผ้าทั่วไป",
    wearingExperience: "ให้สัมผัสสบายสำหรับการใช้งานจริง",
    visualResult: "ลุคใช้งานได้หลากหลาย",
    productionEffect:
      "การเลือกผ้ามีผลต่อการทิ้งตัว ความอยู่ทรง และผลลัพธ์หลังการผลิต",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    outcome.garmentShape = "ทรงผ้าทิ้งตัว ดูสบายและเป็นธรรมชาติ"
    outcome.wearingExperience = "น้ำหนักเบา ระบายอากาศดี เหมาะกับการใส่ทุกวัน"
    outcome.visualResult = "ลุคเสื้อยืดลำลองสำหรับตลาดรีเทล"
    outcome.productionEffect =
      "เหมาะกับงานที่ต้องการความสบายและการเคลื่อนไหวของเนื้อผ้าที่ดูผ่อนคลาย"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    outcome.garmentShape = "ทรงเสื้อดูชัดและมีโครงสร้างมากขึ้น"
    outcome.wearingExperience = "สัมผัสแน่น เรียบ และดูมีคุณภาพมากขึ้น"
    outcome.visualResult = "ผิวผ้าเรียบและดูพรีเมียมขึ้น"
    outcome.productionEffect =
      "เหมาะกับงานที่ต้องการความอยู่ทรงและลุคที่ดูเรียบร้อยกว่า Single Jersey"
  }

  if (name.includes("rib")) {
    outcome.garmentShape = "เหมาะกับส่วนที่ต้องการความยืดหยุ่น"
    outcome.productionEffect =
      "เหมาะกับปก แขน และส่วนที่ต้องการการคืนตัวของเนื้อผ้า"
  }

  if (is20s) {
    outcome.garmentShape = "ทรงผ้าหนัก แน่น และอยู่ทรงมากขึ้น"
    outcome.wearingExperience = "ให้ความรู้สึกแน่นและมีน้ำหนักเวลาใส่"
    outcome.visualResult = "เหมาะกับเสื้อ Oversized และงานพิมพ์ที่ต้องการความทึบ"
    outcome.productionEffect = "เหมาะกับงานที่ต้องการความทึบ ความอยู่ทรง และพื้นผ้าที่รองรับงานสกรีนได้ดี"
  }

  if (is30s) {
    outcome.wearingExperience = "สมดุลระหว่างความนุ่ม น้ำหนัก และการระบายอากาศ"
    outcome.visualResult = "เหมาะกับเสื้อยืดรีเทลและงานใส่ประจำวัน"
    outcome.productionEffect = "เหมาะกับงานที่ต้องการสมดุลระหว่างความใส่สบาย ต้นทุนการผลิต และการใช้งานจริง"
  }

  if (is40s) {
    outcome.garmentShape = "ทรงผ้าดูละเอียดและพลิ้วกว่า"
    outcome.wearingExperience = "สัมผัสเบา ละเอียด และใส่สบายมากขึ้น"
    outcome.visualResult = "ให้ลุคพรีเมียมและผิวผ้าที่ดูสะอาดกว่า"
    outcome.productionEffect = "เหมาะกับงานที่ต้องการสัมผัสละเอียด ลุคสะอาด และภาพลักษณ์พรีเมียมมากกว่าน้ำหนักผ้า"
  }

  if (isCompact) {
    outcome.visualResult = "ผิวผ้าเรียบ ขนผ้าน้อย และดูพรีเมียมขึ้น"
  }


  if (name.includes("cvc") || slug.includes("cvc")) {
    outcome.garmentShape = "ทรงเสื้อคงรูปและดูเรียบร้อยในการใช้งานจริง"
    outcome.wearingExperience = "ให้ความสบายจาก Cotton พร้อมความดูแลง่ายจาก Polyester"
    outcome.visualResult = "เหมาะกับยูนิฟอร์ม เสื้อทีม และงานที่ต้องการความเรียบร้อยสม่ำเสมอ"
    outcome.productionEffect = "ช่วยสมดุลความสบาย ความคงรูป การยับ และต้นทุน เหมาะกับงานผลิตจำนวนหรือใช้งานประจำ"
  }

  return outcome
}
