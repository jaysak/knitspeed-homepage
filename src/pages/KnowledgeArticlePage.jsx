import { useEffect, useMemo } from "react";

import SEOJsonLd from "../components/SEOJsonLd";
import FAQBlock from "../components/knowledge/FAQBlock";
import KnowledgePageLayout from "../components/knowledge/KnowledgePageLayout";
import QuoteCTA from "../components/knowledge/QuoteCTA";
import ReadingProgressBar from "../components/knowledge/ReadingProgressBar";
import OperationalContextBlock from "../components/knowledge/OperationalContextBlock";
import SpecSummaryGrid from "../components/knowledge/SpecSummaryGrid";
import ProductionMemoryPanel from "../components/production/ProductionMemoryPanel";
import { writeBuyerIntentEvent } from "../lib/buyerIntent";
import { getKnowledgePageProductionMemory,
  getKnowledgePageOperationalContext, getRelatedKnowledgePages } from "../lib/knowledgeRegistry";
import {
  KNITSPEED_SITE_URL,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  getCanonicalKnowledgeUrl,
} from "../lib/seoSchema";

function useKnowledgePageMeta(page) {
  useEffect(() => {
    if (!page) {
      return undefined;
    }

    const previousTitle = document.title;
    const description = page.metaDescription || page.subtitle || "";
    let metaDescription = document.querySelector('meta[name="description"]');
    const createdMetaDescription = !metaDescription;
    const previousDescription = metaDescription?.getAttribute("content");

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    document.title = `${page.title} | Knitspeed Textile Knowledge`;
    metaDescription.setAttribute("content", description);

    return () => {
      document.title = previousTitle;

      if (createdMetaDescription) {
        metaDescription.remove();
      } else if (previousDescription === null) {
        metaDescription.removeAttribute("content");
      } else {
        metaDescription.setAttribute("content", previousDescription);
      }
    };
  }, [page]);
}

export default function KnowledgeArticlePage({ page }) {
  useKnowledgePageMeta(page);

  const knowledgeArticle = useMemo(() => {
    if (!page) return null;

    return {
      seoSlug: page.slug,
      articleName: page.title,
      usageSegment: "knowledge",
      materialFamily: "",
      fabricStructure: "",
      linkedProducts: 0,
      leadPriority: "prime",
    };
  }, [page]);

  const relatedPages = useMemo(() => {
    if (!page) return [];

    return getRelatedKnowledgePages(page.slug);
  }, [page]);

  const operationalContext = getKnowledgePageOperationalContext(page.slug);

  const productionMemoryItems = useMemo(() => {
    if (!page) return [];

    return getKnowledgePageProductionMemory(page.slug);
  }, [page]);

  useEffect(() => {
    if (!knowledgeArticle) return;

    writeBuyerIntentEvent("knowledge_article_view", knowledgeArticle);
  }, [knowledgeArticle]);

  if (!page) {
    return (
      <KnowledgePageLayout
        eyebrow="Textile knowledge"
        title="Knowledge page not found"
        subtitle="The requested textile knowledge page is not available."
      />
    );
  }

  const pageUrl = getCanonicalKnowledgeUrl(page);
  const schema = [
    buildOrganizationSchema(),
    buildArticleSchema(page),
    buildFAQPageSchema(page),
    buildBreadcrumbSchema([
      { name: "Home", url: KNITSPEED_SITE_URL },
      { name: page.title, url: pageUrl },
    ]),
  ];

  return (
    <>
      <ReadingProgressBar />
      <SEOJsonLd schema={schema} />
      <KnowledgePageLayout
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        cta={
          <QuoteCTA
            title="Need help applying this to a real fabric order?"
            description="Share your garment use, target hand feel, color, quantity, and production expectations. Knitspeed can help narrow the sourcing options before quoting."
            href="/#quote"
            label="Request quote support"
            article={knowledgeArticle}
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
            {(page.comparison || []).map((item) => (
              <div key={item.name}>
                <h3 className="mb-3 text-lg font-extrabold text-slate-900">{item.name}</h3>
                <SpecSummaryGrid specs={item.specs} />
              </div>
            ))}
          </div>
        </section>

        <ProductionMemoryPanel items={productionMemoryItems} />

        <OperationalContextBlock context={operationalContext} />

        <section>
          <h2 className="text-2xl font-extrabold text-slate-900">Practical buyer guidance</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
            {(page.guidance || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-slate-900">Common mistakes</h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
            {(page.mistakes || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <FAQBlock title="Buyer FAQ" items={page.faqs} />

        {relatedPages.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Related Buyer Guides
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relatedPages.map((relatedPage) => (
                <a
                  key={relatedPage.slug}
                  href={relatedPage.canonicalPath}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <h3 className="font-semibold text-slate-950">{relatedPage.title}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-700">{relatedPage.category}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {relatedPage.metaDescription || relatedPage.subtitle}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}


      </KnowledgePageLayout>
    </>
  );
}
