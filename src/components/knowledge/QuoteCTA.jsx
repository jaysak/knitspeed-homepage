import { ArrowRight } from "lucide-react";
import { writeBuyerIntentEvent } from "../../lib/buyerIntent";
import { storeQuoteAttribution } from "../../lib/quoteAttribution";

export default function QuoteCTA({
  title = "Request a fabric quote",
  description,
  href = "/#quote",
  label = "Get quote",
  article,
}) {
  function handleClick() {
    if (!article?.seoSlug) return;

    writeBuyerIntentEvent("knowledge_quote_click", article);

    storeQuoteAttribution(article);
  }

  return (
    <section className="rounded-3xl bg-sky-50 p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        <a
          href={href}
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
        >
          {label} <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
