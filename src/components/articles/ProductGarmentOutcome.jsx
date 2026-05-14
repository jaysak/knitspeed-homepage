export default function ProductGarmentOutcome({
  garmentShape,
  wearingExperience,
  visualResult,
  productionEffect,
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ผลลัพธ์หลังขึ้นงาน
        </p>

        <p className="mt-1 text-sm text-slate-700">
          การเลือกผ้ามีผลต่อสัมผัส ทรง และภาพลักษณ์ของเสื้อหลังผลิตจริง
        </p>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-3 border border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ทรงเสื้อ
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {garmentShape}
          </p>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ความรู้สึกเวลาใส่
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {wearingExperience}
          </p>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ภาพลักษณ์งานจริง
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {visualResult}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
        {productionEffect}
      </div>
    </div>
  )
}
