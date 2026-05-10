import { getAllKnowledgePages } from "../lib/knowledgeRegistry";

export default function KnowledgeIndexPage() {
  const pages = getAllKnowledgePages();

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-sky-50">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Textile Knowledge
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Knitted Fabric Knowledge
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Practical textile sourcing guidance from Knitspeed and
            GSC Import Export Co., Ltd. focused on knitted fabric structures,
            sourcing considerations, garment applications, and production-aware
            buyer support.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {pages.map((page) => (
            <a
              key={page.slug}
              href={page.canonicalPath}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                {page.category}
              </p>

              <h2 className="mt-3 text-2xl font-extrabold text-slate-950">
                {page.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {page.metaDescription || page.subtitle}
              </p>

              <div className="mt-6 text-sm font-semibold text-sky-700">
                Read article →
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
