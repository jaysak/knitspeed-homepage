export default function OperationalContextBlock({ context }) {
  if (!context?.signals?.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Operational Context
      </p>

      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        Sourcing factors to keep in mind
      </h2>

      <div className="mt-4 space-y-3">
        {context.signals.slice(0, 3).map((signal) => (
          <div key={signal.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium text-slate-900">{signal.label}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {signal.severity}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {signal.buyerImplication}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        These notes are sourcing context, not fixed price or delivery guarantees.
      </p>
    </section>
  );
}
