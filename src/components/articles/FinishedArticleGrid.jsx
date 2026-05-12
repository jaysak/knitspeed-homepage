import { ArrowRight } from "lucide-react";
import { titleize, usageSegmentLabels } from "../../lib/textileLabels";
import ProductInsightBadges from "./ProductInsightBadges";
import ProductVisualGuidance from "./ProductVisualGuidance";
import ProductDecisionConfidence from "./ProductDecisionConfidence";
import ProductComparativeReasoning from "./ProductComparativeReasoning";
import ProductGarmentOutcome from "./ProductGarmentOutcome";
import ProductVisualPlaceholder from "./ProductVisualPlaceholder";
import CollapsibleInsightSection from "./CollapsibleInsightSection";
import { getProductIntelligence } from "../../lib/productIntelligence";
import { getVisualGuidance } from "../../lib/visualGuidance";
import { getDecisionConfidence } from "../../lib/decisionConfidence";
import { getComparativeReasoning } from "../../lib/comparativeReasoning";
import { getGarmentOutcome } from "../../lib/garmentOutcome";
import { getVisualPlaceholder } from "../../lib/visualPlaceholder";
import { getFabricTexture } from "../../lib/fabricTextureMap";
import GarmentOutcomeHints from "../garments/GarmentOutcomeHints";

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
        {articles.map((article) => {
          const intelligence = getProductIntelligence(article);
          const visualGuidance = getVisualGuidance(article);
          const decisionConfidence = getDecisionConfidence(article);
          const comparativeReasoning = getComparativeReasoning(article);
          const garmentOutcome = getGarmentOutcome(article);
          const visualPlaceholder = getVisualPlaceholder(article);

          return (
            <article
              key={article.articleId}
              data-article-slug={article.seoSlug}
              className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
            >
              <div className="flex min-h-28 flex-col justify-between p-5 md:min-h-32 md:p-6" style={{ background: `linear-gradient(135deg, ${brand.paleBlue}, #fff)` }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm">
                    {usageSegmentLabels[article.usageSegment] || titleize(article.usageSegment)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {article.linkedProducts} SKU{article.linkedProducts === 1 ? "" : "s"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold leading-snug md:mt-5 md:text-xl" style={{ color: brand.navy }}>
                  {article.articleName}
                </h3>
              </div>

              <div className="relative h-14 overflow-hidden border-b border-slate-100">
                <img
                  src={getFabricTexture(article)}
                  alt=""
                  className="h-full w-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20" />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{titleize(article.materialFamily)}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{titleize(article.fabricStructure)}</span>
                </div>

                <ProductVisualPlaceholder
                  label={visualPlaceholder.label}
                  mood={visualPlaceholder.mood}
                  texture={visualPlaceholder.texture}
                  gradient={visualPlaceholder.gradient}
                  image={visualPlaceholder.image}
                />

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 md:mt-4">
                  {intelligence.summary}
                </p>

                <p className="mt-2 text-[11px] leading-4 text-slate-400">
                  {article.availableWidths.length
                    ? "Widths: " + article.availableWidths.slice(0, 3).join(", ")
                    : "Widths confirmed after inquiry."}
                </p>

                <ProductInsightBadges
                  useCases={intelligence.useCases}
                  feelTraits={intelligence.feelTraits}
                  productionNotes={intelligence.productionNotes}
                />

                <GarmentOutcomeHints article={article} />

                <button
                  type="button"
                  onClick={() => onArticleSelect(article)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 md:py-3"
                  style={{ backgroundColor: brand.blue }}
                >
                  Request Fabric Quote <ArrowRight size={16} />
                </button>

                <CollapsibleInsightSection title="Buyer Guidance">
                  <ProductVisualGuidance
                    silhouette={visualGuidance.silhouette}
                    fabricMood={visualGuidance.fabricMood}
                    visualTone={visualGuidance.visualTone}
                  />

                  <ProductDecisionConfidence
                    bestFor={decisionConfidence.bestFor}
                    sourcingFit={decisionConfidence.sourcingFit}
                    buyerPerspective={decisionConfidence.buyerPerspective}
                    comparisonHint={decisionConfidence.comparisonHint}
                  />
                </CollapsibleInsightSection>

                <CollapsibleInsightSection title="Comparison Notes">
                  <ProductComparativeReasoning
                    compareAgainst={comparativeReasoning.compareAgainst}
                    softerSide={comparativeReasoning.softerSide}
                    structuredSide={comparativeReasoning.structuredSide}
                    sourcingTradeoff={comparativeReasoning.sourcingTradeoff}
                  />
                </CollapsibleInsightSection>

                <CollapsibleInsightSection title="Garment Outcome">
                  <ProductGarmentOutcome
                    garmentShape={garmentOutcome.garmentShape}
                    wearingExperience={garmentOutcome.wearingExperience}
                    visualResult={garmentOutcome.visualResult}
                    productionEffect={garmentOutcome.productionEffect}
                  />
                </CollapsibleInsightSection>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
