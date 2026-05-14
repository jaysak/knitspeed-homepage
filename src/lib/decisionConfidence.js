const normalize = (value = "") => value.toLowerCase()

export function getDecisionConfidence(article = {}) {
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

  const guidance = {
    bestFor: "เหมาะกับงานเสื้อผ้าถักทั่วไป",
    sourcingFit: "ใช้งานได้ยืดหยุ่นในเชิงพาณิชย์",
    buyerPerspective: "เหมาะเมื่อผู้ซื้อต้องการตัวเลือกผ้าที่ใช้งานได้หลายรูปแบบ",
    comparisonHint: "มักถูกเปรียบเทียบกับผ้าถัก Cotton กลุ่มใกล้เคียง",
  }

  if (name.includes("single jersey") || slug.includes("single-jersey")) {
    guidance.bestFor = "เหมาะกับเสื้อยืดและงานลำลอง"
    guidance.sourcingFit = "ระบายอากาศดี ใส่สบาย และผลิตได้หลากหลาย"
    guidance.buyerPerspective = "เหมาะกับแบรนด์ที่ต้องการผ้า Cotton ใส่สบายสำหรับตลาดทั่วไป"
    guidance.comparisonHint = "มักเปรียบเทียบกับ Interlock เมื่อต้องเลือกระหว่างความนุ่มกับความอยู่ทรง"
  }

  if (name.includes("interlock") || slug.includes("interlock")) {
    guidance.bestFor = "เหมาะกับงานที่ต้องการทรงชัดและผิวผ้าเรียบ"
    guidance.sourcingFit = "ให้โครงสร้างผ้าที่นิ่งกว่าและลุคพรีเมียมขึ้น"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการผ้าที่ดูเรียบร้อย หนาแน่น และคงรูปมากกว่า Single Jersey"
    guidance.comparisonHint = "มักเปรียบเทียบกับ Single Jersey เมื่อต้องเลือกระหว่างความเบาสบายกับโครงสร้างผ้า"
  }

  if (name.includes("rib") || slug.includes("rib")) {
    guidance.bestFor = "เหมาะกับปก แขน ขอบเสื้อ และส่วนที่ต้องการความยืดหยุ่น"
    guidance.sourcingFit = "ช่วยเพิ่มการคืนตัวและความกระชับของชิ้นงาน"
  }

  if (is20s) {
    guidance.bestFor = "เหมาะกับเสื้อ Oversized ยูนิฟอร์ม และงานที่ต้องการเนื้อผ้าแน่น"
    guidance.sourcingFit = "ให้ความทึบ น้ำหนัก และความอยู่ทรงมากขึ้น"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการผ้าที่ดูแข็งแรง ไม่บาง และรับงานพิมพ์หรือสกรีนได้ดี"
    guidance.comparisonHint = "มักเปรียบเทียบกับเบอร์ 30 เมื่อต้องเลือกระหว่างความหนาแน่นกับความเบาสบาย"
  }

  if (is30s) {
    guidance.bestFor = "เหมาะกับเสื้อยืดรีเทลทั่วไปและงานใส่ประจำวัน"
    guidance.sourcingFit = "สมดุลระหว่างความนุ่ม น้ำหนักผ้า และการระบายอากาศ"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการผ้าที่ใช้งานง่าย ไม่หนักเกินไป และเหมาะกับหลายตลาด"
    guidance.comparisonHint = "มักเปรียบเทียบกับเบอร์ 20 หรือ 40 เพื่อเลือกสมดุลระหว่างความหนาและความละเอียด"
  }

  if (is40s) {
    guidance.bestFor = "เหมาะกับงานพรีเมียมที่ต้องการผิวผ้าเรียบและสัมผัสละเอียด"
    guidance.sourcingFit = "ให้ความเบา ละเอียด และภาพลักษณ์สะอาดกว่างาน Cotton ทั่วไป"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการลุคพรีเมียม เบาสบาย และผิวผ้าที่ดูเรียบร้อย"
    guidance.comparisonHint = "มักเปรียบเทียบกับเบอร์ 30 เมื่อต้องเลือกระหว่างความทนแน่นกับความละเอียดของสัมผัส"
  }

  if (isCompact) {
    guidance.sourcingFit = "ผิวผ้าเรียบ ขนผ้าน้อย และให้ภาพลักษณ์พรีเมียมขึ้น"
    guidance.buyerPerspective = "เหมาะกับแบรนด์ที่ต้องการผิวผ้าดูสะอาด สัมผัสดี และลดความรู้สึกหยาบของเส้นด้าย"
  }

  if (isCombed && !isSemiCombed && !isCompact) {
    guidance.sourcingFit = "สัมผัสนุ่มและเหมาะกับงาน Cotton คุณภาพดี"
  }

  if (isSemiCombed) {
    guidance.sourcingFit = "เหมาะกับงานเชิงพาณิชย์ที่ต้องการสมดุลระหว่างคุณภาพและต้นทุน"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการผ้าที่ใช้งานได้จริงในราคาควบคุมง่ายกว่ากลุ่มพรีเมียม"
  }


  if (name.includes("cvc") || slug.includes("cvc")) {
    guidance.bestFor = "เหมาะกับยูนิฟอร์ม เสื้อทีม และงานเชิงพาณิชย์ที่ต้องการความคุ้มค่า"
    guidance.sourcingFit = "Cotton 60/40 Poly ให้สมดุลระหว่างความสบาย ความคงรูป และการดูแลง่าย"
    guidance.buyerPerspective = "เหมาะเมื่อผู้ซื้อต้องการผ้าที่ใส่สบายกว่าโพลีล้วน แต่ควบคุมต้นทุนและการยับได้ดีกว่า Cotton 100%"
    guidance.comparisonHint = "มักเปรียบเทียบกับ Cotton 100% เมื่อต้องเลือกระหว่างสัมผัสธรรมชาติกับความคงรูปและต้นทุน"
  }

  return guidance
}
