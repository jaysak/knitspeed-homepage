export default function KnowledgePageLayout({
  eyebrow,
  title,
  subtitle,
  children,
  cta,
}) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section className="border-b border-sky-100 bg-sky-50/70 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          {eyebrow ? (
            <div className="mb-4 text-sm font-bold uppercase tracking-wide text-sky-700">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="space-y-12">{children}</div>
        {cta ? <div className="mt-12">{cta}</div> : null}
      </div>
    </main>
  );
}
