export default function ProductVisualPlaceholder({
  label,
  gradient,
  image,
}) {
  return (
    <div
      className={
        "relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-4 " +
        gradient
      }
    >
      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="relative">
        <div className="min-h-[170px] overflow-hidden">
          <div className="absolute inset-x-0 top-0 p-3">
            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/55">
              Textile Visual
            </p>

            <h3 className="mt-0.5 text-[11px] font-medium text-white/75">
              {label}
            </h3>
          </div>
        </div>

      </div>
    </div>
  )
}
