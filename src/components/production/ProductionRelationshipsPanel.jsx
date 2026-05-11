export default function ProductionRelationshipsPanel({ summary }) {
  if (!summary?.affectedAreas?.length) {
    return null;
  }

  const affectedAreas = summary.affectedAreas.slice(0, 3);
  const topicLabels = summary.labels?.join(" and ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Production relationships
      </p>

      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        Production relationships
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {topicLabels
          ? `${topicLabels} can sit close to several production considerations when fabric is sourced for real garments.`
          : "This topic can sit close to several production considerations when fabric is sourced for real garments."}
      </p>

      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
        {affectedAreas.map((area) => (
          <li key={area} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
            <span>{area}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
