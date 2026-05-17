import { ArrowRight, CheckCircle2, Shirt, Waves, Weight } from "lucide-react";

export default function TShirtFabricSourcingGuide({ brand }) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section
        className="border-b border-sky-100"
        style={{
          background: `linear-gradient(135deg, ${brand.iceBlue}, #ffffff 55%, ${brand.paleBlue})`,
        }}
      >
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <div className="inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
            คู่มือเลือกผ้าตามประเภทงานผลิต
          </div>

          <h1
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
            style={{ color: brand.navy }}
          >
            คู่มือเลือกผ้าสำหรับเสื้อยืด
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            เข้าใจความแตกต่างของโครงสร้างผ้า คุณภาพเส้นด้าย GSM และการ finishing
            เพื่อเลือกผ้าที่เหมาะกับเสื้อยืดมากขึ้น
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Single Jersey",
              "Compact Cotton",
              "Printing Performance",
              "การเลือก GSM ให้เหมาะกับงาน",
              "Breathability",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Shirt className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              เสื้อยืดใส่ประจำวัน
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              30s Single Jersey ให้สัมผัสสมดุลทั้งความนุ่ม
              การระบายอากาศ และต้นทุนการผลิต เหมาะกับเสื้อยืดใช้งานทั่วไป
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Waves className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              สัมผัสผ้า Premium มากขึ้น
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Compact Cotton และ Combed Yarn ช่วยให้ผิวผ้าเรียบขึ้น
              ลดขนผิว และทำให้เสื้อดู clean มากขึ้น
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Weight className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              การเลือก GSM ให้เหมาะกับงาน
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              GSM ที่เบากว่าจะช่วยเรื่องการระบายอากาศ
              ส่วน GSM ระดับกลางถึงสูง จะให้ทรงและความทึบของผ้าที่มากขึ้น
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-[2rem] bg-slate-50 p-8 md:p-10">
          <h2
            className="text-3xl font-extrabold"
            style={{ color: brand.navy }}
          >
            โครงสร้างผ้าที่แนะนำ
          </h2>

          <div className="mt-8 space-y-5">
            {[
              {
                title: "30s Combed Cotton Single Jersey",
                text: "สมดุลระหว่างความนุ่ม การระบายอากาศ และความเหมาะกับงานสกรีนสำหรับเสื้อยืดทั่วไป",
              },
              {
                title: "30s Compact Cotton Single Jersey",
                text: "ผิวผ้าเรียบขึ้นและสัมผัสดูพรีเมียม เหมาะกับงานเสื้อผ้าระดับสูงขึ้น",
              },
              {
                title: "TC Single Jersey",
                text: "คงรูปและทนต่อการซัก เหมาะกับยูนิฟอร์มและงานใช้งานต่อเนื่อง",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 text-sky-500" />
                  <div>
                    <h3
                      className="text-lg font-extrabold"
                      style={{ color: brand.navy }}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/#quote"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-white shadow-sm transition hover:translate-y-[-1px]"
            style={{ backgroundColor: brand.blue }}
          >
            ขอราคาผ้า <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
