import { ArrowRight } from "lucide-react";
import { titleize, usageSegmentLabels } from "../../lib/textileLabels";

export default function FinishedArticleGrid({ articles, brand, onArticleSelect }) {
  return (
    <section id="products" className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: brand.navy }}>Finished Articles</h2>
          <p className="mt-3 text-slate-600">Buyer-facing fabric articles mapped from current production data.</p>
        </div>
        <a href="#quote" className="font-bold text-sky-600">Request custom GSM / color →</a>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.articleId}
            data-article-slug={article.seoSlug}
            className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
          >
            <div className="flex min-h-32 flex-col justify-between p-6" style={{ background: `linear-gradient(135deg, ${brand.paleBlue}, #fff)` }}>
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm">
                  {usageSegmentLabels[article.usageSegment] || titleize(article.usageSegment)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {article.linkedProducts} SKU{article.linkedProducts === 1 ? "" : "s"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold leading-snug" style={{ color: brand.navy }}>
                {article.articleName}
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">{titleize(article.materialFamily)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{titleize(article.fabricStructure)}</span>
                {article.yarnCount ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">{article.yarnCount}s</span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {article.availableWidths.length
                  ? `Available widths: ${article.availableWidths.slice(0, 4).join('", ')}"`
                  : "Width options confirmed after inquiry."}
              </p>
              <button
                type="button"
                onClick={() => onArticleSelect(article)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: brand.blue }}
              >
                Quote this article <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
