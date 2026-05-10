const specLabels = {
  composition: "Composition",
  structure: "Structure",
  width: "Width",
  gsm: "GSM",
  moq: "MOQ",
  useCases: "Use cases",
};

export default function SpecSummaryGrid({ specs = {} }) {
  const entries = Object.entries(specLabels)
    .map(([key, label]) => ({ key, label, value: specs[key] }))
    .filter((item) => item.value);

  if (!entries.length) return null;

  return (
    <section aria-label="Textile specification summary">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-base font-semibold text-slate-900">
              {Array.isArray(item.value) ? item.value.join(", ") : item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
