export default function RelatedKnowledgeContinuity({
  relatedKnowledge = [],
  relatedGarments = [],
}) {
  if (!relatedKnowledge.length && !relatedGarments.length) {
    return null;
  }

  return (
    <section className="mt-12 rounded-[2rem] border border-slate-100 bg-slate-50/70 p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
            Related Textile Guidance
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {relatedKnowledge.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                → {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
            Common Garment Directions
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {relatedGarments.map((garment) => (
              <span
                key={garment}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {garment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
