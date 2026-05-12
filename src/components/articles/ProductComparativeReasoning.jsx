export default function ProductComparativeReasoning({
  compareAgainst,
  softerSide,
  structuredSide,
  sourcingTradeoff,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Buyer Comparison Context
          </p>

          <p className="mt-1 text-sm text-slate-700">
            Commonly evaluated against {compareAgainst}.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Softer Feel
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {softerSide}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              More Structure
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {structuredSide}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 text-sm leading-relaxed text-slate-600 border border-slate-200">
          {sourcingTradeoff}
        </div>
      </div>
    </div>
  )
}
