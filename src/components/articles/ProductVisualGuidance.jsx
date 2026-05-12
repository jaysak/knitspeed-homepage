export default function ProductVisualGuidance({
  silhouette,
  fabricMood,
  visualTone,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
          ✦
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Commonly Used For
            </p>
            <p className="text-sm font-medium text-slate-900">
              {silhouette}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
              {fabricMood}
            </span>

            <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
              {visualTone}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
