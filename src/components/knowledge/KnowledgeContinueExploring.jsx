const DEFAULT_LINKS = [
  {
    label: "Explore Finished Fabrics",
    href: "/#finished-articles",
    description: "Browse sourcing-ready knitted fabric articles.",
  },
  {
    label: "Return to Textile Knowledge",
    href: "/knowledge",
    description: "Continue exploring practical textile guidance.",
  },
  {
    label: "Request Related Fabric Quote",
    href: "/#quote",
    description: "Discuss GSM, structure, printing, or sourcing needs.",
  },
];

export default function KnowledgeContinueExploring({
  links = DEFAULT_LINKS,
}) {
  return (
    <section className="mt-16 border-t border-slate-100 pt-10">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
          Continue Exploring
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          Continue your sourcing journey
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Explore related fabric knowledge, compare sourcing directions,
          or continue toward production inquiry.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-sky-100 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 transition group-hover:text-sky-700">
                  {link.label}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {link.description}
                </p>
              </div>

              <span className="text-sky-500 transition group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
