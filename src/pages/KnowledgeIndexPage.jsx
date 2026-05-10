import { useEffect } from "react";

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

export default function KnowledgeIndexPage() {
  useKnowledgeIndexMeta();

  const pages = getAllKnowledgePages();
  const clusters = getKnowledgeTopicClusters();

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
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Knowledge Topics
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {clusters.map((cluster) => (
              <a
                key={cluster.key}
                href={`#${cluster.key}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                {cluster.label} ({cluster.pages.length})
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {pages.map((page) => (
            <a
              key={page.slug}
              id={page.topicCluster}
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
      </section>
    </div>
  );
}
