export default function ProductionMemoryPanel({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
          Production considerations
        </p>
      </div>

      <div className="mt-5 space-y-6">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-amber-100 bg-white/80 p-5"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {item.key}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Dye consistency: {item.memory.dyeConsistency}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Shrinkage risk: {item.memory.shrinkageRisk}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Sourcing complexity: {item.memory.sourcingComplexity}
              </span>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Common production concerns
                </p>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {item.memory.commonIssues.map((issue) => (
                    <li key={issue}>• {issue}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Operational guidance
                </p>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {item.memory.productionNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
