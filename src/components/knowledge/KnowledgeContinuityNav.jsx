export default function KnowledgeContinuityNav({
  backHref = "/knowledge",
  backLabel = "Back to Knowledge",
}) {
  return (
    <div className="border-b border-sky-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label="Knitspeed home">
          <img
            src="/branding/knitspeed-logo.png"
            alt="Knitspeed"
            className="h-8 w-auto shrink-0"
          />
          <span className="hidden truncate text-xs font-medium text-slate-500 sm:block">
            Built on Textile Intelligence
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-4 text-sm font-medium">
          <a
            href={backHref}
            className="text-slate-600 transition hover:text-slate-950"
          >
            ← {backLabel}
          </a>

          <a
            href="/#finished-articles"
            className="text-emerald-700 transition hover:text-emerald-900"
          >
            Explore Fabrics
          </a>
        </div>
      </div>
    </div>
  );
}
