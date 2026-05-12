export default function ProductDecisionConfidence({
  bestFor,
  sourcingFit,
  buyerPerspective,
  comparisonHint,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Best For
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {bestFor}
          </p>
        </div>

        <div className="grid gap-2 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <span className="font-medium text-slate-800">Sourcing fit:</span>{" "}
            {sourcingFit}
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <span className="font-medium text-slate-800">Buyer perspective:</span>{" "}
            {buyerPerspective}
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <span className="font-medium text-slate-800">Often compared with:</span>{" "}
            {comparisonHint}
          </div>
        </div>
      </div>
    </div>
  )
}
