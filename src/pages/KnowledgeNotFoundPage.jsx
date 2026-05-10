export default function KnowledgeNotFoundPage({ articles = [] }) {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Knowledge Library
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            Knowledge article not found
          </h1>

          <p className="mt-4 text-neutral-400 leading-relaxed">
            The textile knowledge page you requested does not exist or has not
            been published yet.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          <a
            href="/knowledge"
            className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:opacity-90 transition"
          >
            Browse Knowledge Library
          </a>

          <a
            href="/#quote"
            className="rounded-xl border border-neutral-700 px-5 py-3 font-medium hover:border-neutral-500 transition"
          >
            Request Fabric Help
          </a>
        </div>

        {articles.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-4">
              Available Knowledge Articles
            </h2>

            <div className="grid gap-4">
              {articles.map((article) => (
                <a
                  key={article.slug}
                  href={`/knowledge/${article.slug}`}
                  className="rounded-2xl border border-neutral-800 p-5 hover:border-neutral-600 transition"
                >
                  <div className="text-lg font-medium">
                    {article.title}
                  </div>

                  {article.shortAnswer && (
                    <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                      {article.shortAnswer}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
