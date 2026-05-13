export default function GarmentGuideCard() {
  const chips = ["Oversized Tees", "Premium Cotton", "Printing", "Streetwear"];

  return (
    <section className="rounded-[2rem] border border-sky-100 bg-white/90 shadow-sm overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[220px] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 flex items-center justify-center">
          <div className="relative z-10 h-36 w-36 rounded-[2rem] bg-white/80 border border-sky-100 shadow-sm flex items-center justify-center">
            <img
              src="/visuals/garments/tshirt-silhouette.png"
              alt="T-shirt fabric sourcing silhouette"
              className="h-28 w-28 object-contain opacity-80"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sky-700 text-5xl font-black opacity-10">
              T
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-8 lg:p-10 flex flex-col justify-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">
            Garment Sourcing Guide
          </p>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            T-Shirt Fabric Sourcing
          </h2>

          <p className="mt-4 max-w-xl text-slate-600 leading-relaxed">
            A practical guide for choosing fabric structure, hand feel, GSM,
            printability, and production fit before requesting a quote.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"
              >
                {chip}
              </span>
            ))}
          </div>

          <a
            href="/knowledge/t-shirt-fabric-sourcing"
            className="mt-7 inline-flex w-fit items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-sky-500"
          >
            Explore T-Shirt Guide →
          </a>
        </div>
      </div>
    </section>
  );
}
