import FAQBlock from "../components/knowledge/FAQBlock";
import KnowledgePageLayout from "../components/knowledge/KnowledgePageLayout";
import QuoteCTA from "../components/knowledge/QuoteCTA";
import SpecSummaryGrid from "../components/knowledge/SpecSummaryGrid";

export default function KnowledgeArticlePage({ page }) {
  if (!page) {
    return (
      <KnowledgePageLayout
        eyebrow="Textile knowledge"
        title="Knowledge page not found"
        subtitle="The requested textile knowledge page is not available."
      />
    );
  }

  return (
    <KnowledgePageLayout
      eyebrow={page.eyebrow}
      title={page.title}
      subtitle={page.subtitle}
      cta={
        <QuoteCTA
          title="Need help choosing a knitted fabric?"
          description="Share your garment use, target hand feel, color, and quantity. Knitspeed can help narrow the sourcing options before quoting."
          href="/#quote"
          label="Request quote support"
        />
      }
    >
      <section>
        <h2 className="text-2xl font-extrabold text-slate-900">Short answer</h2>
        <p className="mt-4 text-base leading-8 text-slate-600">{page.shortAnswer}</p>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-slate-900">Comparison summary</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {page.comparison.map((item) => (
            <div key={item.name}>
              <h3 className="mb-3 text-lg font-extrabold text-slate-900">{item.name}</h3>
              <SpecSummaryGrid specs={item.specs} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-slate-900">Practical buyer guidance</h2>
        <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
          {page.guidance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-slate-900">Common mistakes</h2>
        <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
          {page.mistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <FAQBlock title="Buyer FAQ" items={page.faqs} />
    </KnowledgePageLayout>
  );
}
