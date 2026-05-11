export default function ManufacturingSensitivityNote({ sensitivity }) {
  if (!sensitivity || sensitivity.level === "stable") {
    return null;
  }

  const label =
    sensitivity.level === "high"
      ? "Higher production sensitivity topic"
      : sensitivity.level === "moderate"
      ? "Moderate production sensitivity topic"
      : "Production consideration topic";

  return (
    <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
        Manufacturing Sensitivity
      </p>

      <h2 className="mt-2 text-lg font-semibold text-slate-900">{label}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-700">
        This topic may involve production variables that should be discussed before
        quotation or bulk approval.
      </p>

      {sensitivity.reasons?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {sensitivity.reasons.slice(0, 4).map((reason) => (
            <span
              key={reason}
              className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm"
            >
              {reason}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
