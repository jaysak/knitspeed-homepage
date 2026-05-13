export default function GarmentGuideCard() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div className="bg-sky-50 px-8 py-10 md:px-10 md:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-700">
          Garment Sourcing Guide
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
          T-Shirt Fabric Sourcing
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          A practical guide for choosing fabric structure, hand feel, GSM,
          printability, and production fit before requesting a quote.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Oversized Tees",
            "Premium Cotton",
            "Printing",
            "Streetwear",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="/knowledge/tshirt-fabric-sourcing-guide"
          className="mt-8 inline-flex items-center rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
        >
          Explore T-Shirt Guide →
        </a>
      </div>
    </section>
  );
}
