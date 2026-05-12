import { useEffect, useMemo } from "react";

import SEOJsonLd from "../components/SEOJsonLd";
import FAQBlock from "../components/knowledge/FAQBlock";
import KnowledgePageLayout from "../components/knowledge/KnowledgePageLayout";
import QuoteCTA from "../components/knowledge/QuoteCTA";
import ReadingProgressBar from "../components/knowledge/ReadingProgressBar";
import OperationalContextBlock from "../components/knowledge/OperationalContextBlock";
import ManufacturingSensitivityNote from "../components/knowledge/ManufacturingSensitivityNote";
import KnowledgeWatermark from "../components/branding/KnowledgeWatermark";
import KnowledgeContinuityNav from "../components/knowledge/KnowledgeContinuityNav";
import SpecSummaryGrid from "../components/knowledge/SpecSummaryGrid";
import ProductionMemoryPanel from "../components/production/ProductionMemoryPanel";
import ProductionRelationshipsPanel from "../components/production/ProductionRelationshipsPanel";
import MobileDisclosure from "../components/ui/MobileDisclosure";
import { writeBuyerIntentEvent } from "../lib/buyerIntent";
import { usePageMeta } from "../lib/usePageMeta";
import KnowledgeContinueExploring from "../components/knowledge/KnowledgeContinueExploring";
import RelatedKnowledgeContinuity from "../components/knowledge/RelatedKnowledgeContinuity";
import { getKnowledgeContinuity } from "../lib/knowledgeContinuityMap";
import { getKnowledgePageProductionMemory,
  getKnowledgePageOperationalContext,
  getKnowledgePageManufacturingSensitivity,
  getKnowledgePageManufacturingCausality,
  getRelatedKnowledgePages } from "../lib/knowledgeRegistry";
import {
  KNITSPEED_SITE_URL,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  getCanonicalKnowledgeUrl,
} from "../lib/seoSchema";

const RELATED_GUIDE_LABELS = {
  "fabric-structures": "Related Fabric Structure Guides",
  "fabric-behavior": "Related Fabric Behavior Guides",
  "fabric-specification": "Related Fabric Specification Guides",
  "fabric-finishing": "Related Finishing Guides",
  "textile-production": "Related Textile Production Guides",
  "yarn-quality": "Related Yarn Quality Guides",
  "Fabric Dyeing": "Related Dyeing Guides",
  "Fabric Finishing": "Related Finishing Guides",
  "Textile Production": "Related Textile Production Guides",
};

function getRelatedGuideLabel(page) {
  return RELATED_GUIDE_LABELS[page?.topicCluster] || "Related Textile Guides";
}

export default function KnowledgeArticlePage({ page }) {
  usePageMeta({
    title: page ? `${page.title} | Knitspeed Textile Knowledge` : undefined,
    description: page ? page.metaDescription || page.subtitle || "" : undefined,
    canonicalUrl: page ? getCanonicalKnowledgeUrl(page) : undefined,
  });

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

  const operationalContext = getKnowledgePageOperationalContext(page?.slug);
  const manufacturingSensitivity = getKnowledgePageManufacturingSensitivity(page?.slug);
  const manufacturingCausality = getKnowledgePageManufacturingCausality(page?.slug);

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
      <>
        <KnowledgeContinuityNav />

      <KnowledgePageLayout
          eyebrow="Textile knowledge"
          title="Knowledge page not found"
          subtitle="The requested textile knowledge page is not available."
        />
      </>
    );
  }

  const pageUrl = getCanonicalKnowledgeUrl(page);
  
  const continuity = getKnowledgeContinuity(page.slug);

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
      <KnowledgeWatermark />
      <SEOJsonLd schema={schema} />

      <KnowledgeContinuityNav />

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

        <MobileDisclosure title="Production notes">
          <ProductionMemoryPanel items={productionMemoryItems} />
        </MobileDisclosure>

        <MobileDisclosure title="Sourcing context">
          <OperationalContextBlock context={operationalContext} />
        </MobileDisclosure>

        {manufacturingCausality?.affectedAreas?.length > 0 && (
          <MobileDisclosure title="Production relationships">
            <ProductionRelationshipsPanel summary={manufacturingCausality} />
          </MobileDisclosure>
        )}

        <ManufacturingSensitivityNote sensitivity={manufacturingSensitivity} />

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

        <MobileDisclosure title="Buyer FAQ">
          <FAQBlock title="Buyer FAQ" items={page.faqs} />
        </MobileDisclosure>

        {relatedPages.length > 0 && (
          <MobileDisclosure title={getRelatedGuideLabel(page)}>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                {getRelatedGuideLabel(page)}
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
          </MobileDisclosure>
        )}


      
        
        <RelatedKnowledgeContinuity
          relatedKnowledge={continuity.relatedKnowledge}
          relatedGarments={continuity.relatedGarments}
        />

        <KnowledgeContinueExploring />


</KnowledgePageLayout>
    </>
  );
}
