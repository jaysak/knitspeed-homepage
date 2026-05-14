export default function BrandIdentitySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
          Built on Textile Intelligence
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Knitspeed ช่วยให้การเลือกผ้ายืดสำหรับงานผลิตจริงแม่นยำขึ้น
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Knitspeed คือแพลตฟอร์มจัดหาผ้ายืดคุณภาพสำหรับแบรนด์ โรงงาน และผู้ผลิตเสื้อผ้าในไทย
                เราไม่ได้มองผ้าแค่เป็นสินค้าในแคตตาล็อก แต่เข้าใจตั้งแต่เส้นด้าย โครงสร้างผ้า การย้อม
                การฟินิชชิ่ง การหดตัว ไปจนถึงผลลัพธ์จริงบนตัวเสื้อ
              </p>

              <p className="hidden sm:block">
                จุดแข็งของเราคือการช่วยลูกค้าเลือกผ้าที่เหมาะกับงานผลิตจริง ทั้งด้านสัมผัส ความหนา
                การระบายอากาศ ความคงรูป การพิมพ์/สกรีน และความพร้อมในการส่งมอบ เพื่อให้การสั่งผ้าแม่นยำขึ้น
                ลดความเสี่ยง และคุยสเปกได้ชัดเจนตั้งแต่ก่อนขอราคา
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              "Premium Cotton Fabrics",
              "Production-Aware Sourcing",
              "Knitted Fabric Expertise",
              "Thailand Manufacturing Network",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
