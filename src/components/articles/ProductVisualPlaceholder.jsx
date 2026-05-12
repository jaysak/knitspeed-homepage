export default function ProductVisualPlaceholder({
  label,
  mood,
  texture,
  gradient,
}) {
  return (
    <div
      className={
        "mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-4 " +
        gradient
      }
    >
      <div className="flex min-h-[104px] flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Future Textile Visual Layer
          </p>

          <h3 className="mt-1.5 text-base font-semibold text-slate-900">
            {label}
          </h3>

          <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-600">
            Reserved for future fabric imagery and garment-use visuals.
          </p>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/70 bg-white/70 p-2.5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Garment Mood
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {mood}
            </p>
          </div>

          <div className="rounded-xl border border-white/70 bg-white/70 p-2.5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Surface Direction
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {texture}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
