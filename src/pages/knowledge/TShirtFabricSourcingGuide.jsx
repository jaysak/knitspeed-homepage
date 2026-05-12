import { ArrowRight, CheckCircle2, Shirt, Waves, Weight } from "lucide-react";

export default function TShirtFabricSourcingGuide({ brand }) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section
        className="border-b border-sky-100"
        style={{
          background: `linear-gradient(135deg, ${brand.iceBlue}, #ffffff 55%, ${brand.paleBlue})`,
        }}
      >
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <div className="inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
            Garment Sourcing Guide
          </div>

          <h1
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
            style={{ color: brand.navy }}
          >
            T-Shirt Fabric Sourcing Guide
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Learn how fabric structure, yarn quality, GSM, and finishing affect
            softness, breathability, durability, printability, and garment outcome
            for T-shirt production.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Single Jersey",
              "Compact Cotton",
              "Printing Performance",
              "GSM Selection",
              "Breathability",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Shirt className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              Everyday T-Shirts
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              30s Single Jersey remains one of the most balanced structures for
              softness, breathability, production efficiency, and commercial pricing.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Waves className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              Premium Hand Feel
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Compact cotton and combed yarns improve surface smoothness,
              reduce hairiness, and create cleaner garment appearance.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <Weight className="mb-4 text-sky-500" size={30} />
            <h2 className="text-xl font-extrabold" style={{ color: brand.navy }}>
              GSM Selection
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Lightweight fabrics improve breathability while mid-weight GSM
              supports better structure, opacity, and durability.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-[2rem] bg-slate-50 p-8 md:p-10">
          <h2
            className="text-3xl font-extrabold"
            style={{ color: brand.navy }}
          >
            Recommended Fabric Structures
          </h2>

          <div className="mt-8 space-y-5">
            {[
              {
                title: "30s Combed Cotton Single Jersey",
                text: "Balanced softness, breathability, and printability for everyday T-shirt production.",
              },
              {
                title: "30s Compact Cotton Single Jersey",
                text: "Cleaner surface and premium hand feel for elevated apparel programs.",
              },
              {
                title: "TC Single Jersey",
                text: "Better durability and shape retention for uniforms and repeated washing.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 text-sky-500" />
                  <div>
                    <h3
                      className="text-lg font-extrabold"
                      style={{ color: brand.navy }}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "30s Combed Cotton Single Jersey",
                description:
                  "Balanced softness, breathability, and printability for everyday T-shirt production.",
              },
              {
                title: "30s Compact Cotton Single Jersey",
                description:
                  "Cleaner surface and smoother hand feel for elevated apparel collections.",
              },
              {
                title: "TC Single Jersey",
                description:
                  "Durable structure for uniforms, repeated washing, and stable production runs.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm"
              >
                <div
                  className="text-lg font-extrabold"
                  style={{ color: brand.navy }}
                >
                  {item.title}
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <a
                  href="/#quote"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:text-sky-900"
                >
                  Request sourcing quote →
                </a>
              </div>
            ))}
          </div>

          <a
            href="/#quote"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-white shadow-sm transition hover:translate-y-[-1px]"
            style={{ backgroundColor: brand.blue }}
          >
            Request Fabric Quote <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
