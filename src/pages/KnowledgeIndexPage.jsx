import { useEffect, useMemo, useState } from "react";

import SEOJsonLd from "../components/SEOJsonLd";
import {
  buildBreadcrumbSchema,
  buildKnowledgeCollectionSchema,
  buildOrganizationSchema,
  KNITSPEED_SITE_URL,
} from "../lib/seoSchema";
import {
  getAllKnowledgePages,
  getKnowledgeTopicClusters,
} from "../lib/knowledgeRegistry";

function useKnowledgeIndexMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    const createdMetaDescription = !metaDescription;
    const previousDescription = metaDescription?.getAttribute("content");

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    document.title = "Textile Knowledge | Knitspeed";
    metaDescription.setAttribute(
      "content",
      "Practical knitted fabric sourcing guidance from Knitspeed and GSC Import Export Co., Ltd."
    );

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
  }, []);
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function pageMatchesSearch(page, searchTerm) {
  const query = normalizeText(searchTerm);

  if (!query) {
    return true;
  }

  const searchableText = [
    page.title,
    page.subtitle,
    page.metaDescription,
    page.shortAnswer,
    page.category,
    page.topicCluster,
    page.buyerIntent,
    ...(page.tags || []),
  ]
    .map(normalizeText)
    .join(" ");

  return searchableText.includes(query);
}

export default function KnowledgeIndexPage() {
  useKnowledgeIndexMeta();

  const pages = getAllKnowledgePages();
  const clusters = getKnowledgeTopicClusters();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCluster, setActiveCluster] = useState("all");

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesCluster =
        activeCluster === "all" || page.topicCluster === activeCluster;

      return matchesCluster && pageMatchesSearch(page, searchTerm);
    });
  }, [pages, searchTerm, activeCluster]);

  const schema = [
    buildOrganizationSchema(),
    buildKnowledgeCollectionSchema(pages),
    buildBreadcrumbSchema([
      { name: "Home", url: KNITSPEED_SITE_URL },
      { name: "Textile Knowledge", url: `${KNITSPEED_SITE_URL}/knowledge` },
    ]),
  ];

  return (
    <div className="bg-slate-50">
      <SEOJsonLd schema={schema} />

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

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                Find Buyer Guides
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                Search textile knowledge
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Filter by topic, fabric term, garment use, or sourcing question.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              <label htmlFor="knowledge-search" className="sr-only">
                Search knowledge articles
              </label>
              <input
                id="knowledge-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search GSM, compact cotton, jersey..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveCluster("all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCluster === "all"
                  ? "border-sky-400 bg-sky-100 text-sky-800"
                  : "border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              All topics ({pages.length})
            </button>

            {clusters.map((cluster) => (
              <button
                key={cluster.key}
                type="button"
                onClick={() => setActiveCluster(cluster.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCluster === cluster.key
                    ? "border-sky-400 bg-sky-100 text-sky-800"
                    : "border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                {cluster.label} ({cluster.pages.length})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-600">
            Showing {filteredPages.length} of {pages.length} guides
          </p>

          {(searchTerm || activeCluster !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCluster("all");
              }}
              className="text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredPages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPages.map((page) => (
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

                {page.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {page.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-sm font-semibold text-sky-700">
                  Read article →
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-950">
              No matching guides yet
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Try a broader fabric term, clear the filters, or request sourcing
              help if you need a specific knitted fabric answer.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCluster("all");
              }}
              className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Reset knowledge filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
