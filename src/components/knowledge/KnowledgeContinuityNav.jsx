export default function KnowledgeContinuityNav({
  backHref = "/knowledge",
  backLabel = "Back to Knowledge",
}) {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <a
        href={backHref}
        className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
      >
        ← {backLabel}
      </a>

      <a
        href="/#finished-articles"
        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
      >
        Explore Fabrics
      </a>
    </div>
  );
}
