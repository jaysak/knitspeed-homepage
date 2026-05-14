import { Mail, MapPin, Phone } from "lucide-react";
import { titleize, usageSegmentLabels } from "../lib/textileLabels";
import ProductVisualPlaceholder from "./articles/ProductVisualPlaceholder";
import { getVisualPlaceholder } from "../lib/visualPlaceholder";

export default function QuoteForm({
  brand,
  clearSelectedArticle,
  fabricStructureOptions,
  handleQuoteSubmit,
  materialFamilyOptions,
  selectedArticle,
  selectedFabricStructure,
  selectedMaterialFamily,
  selectedWidthInches,
  selectedYarnCount,
  setSelectedFabricStructure,
  setSelectedMaterialFamily,
  setSelectedWidthInches,
  setSelectedYarnCount,
  submitError,
  submitStatus,
  widthOptions,
  yarnCountOptions,
}) {
  return (
      <section id="quote" className="py-16" style={{ backgroundColor: brand.iceBlue }}>
  <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2">
    <div>
      <h2
        className="text-3xl font-extrabold md:text-4xl"
        style={{ color: brand.navy }}
      >
        ขอราคาผ้า
      </h2>

      <p className="mt-4 text-lg leading-8 text-slate-600">
        Send fabric type, GSM, color, quantity and usage.
        Our team will respond quickly via LINE or phone.
      </p>

      <div className="mt-8 space-y-4 text-slate-600">
        <div className="flex gap-3">
          <Phone className="text-sky-500" />
          090-912-4154
        </div>

        <div className="flex gap-3">
          <Mail className="text-sky-500" />
          knitspeed@hotmail.com
        </div>

        <div className="flex gap-3">
          <MapPin className="text-sky-500" />
          Bangkok, Thailand
        </div>
      </div>
    </div>

    <form
      onSubmit={handleQuoteSubmit}
      className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-100 md:p-8"
    >
      <input
        type="hidden"
        name="inquiry_source"
        value={selectedArticle ? "finished_article_card" : "homepage_quote_form"}
      />
      <input type="hidden" name="lead_priority" value={selectedArticle?.leadPriority || "prime"} />
      <input type="hidden" name="article_slug" value={selectedArticle?.seoSlug || "homepage-quote"} />
      <input type="hidden" name="article_name" value={selectedArticle?.articleName || "Homepage Quote Inquiry"} />
      <input type="hidden" name="usage_segment" value={selectedArticle?.usageSegment || ""} />

      {selectedArticle ? (
        <div className="mb-5 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50">
          <div className="grid gap-4 p-4 sm:grid-cols-[0.85fr_1.15fr] sm:items-center">
            <div className="overflow-hidden rounded-2xl bg-white">
              <ProductVisualPlaceholder
                label={getVisualPlaceholder(selectedArticle).label}
                mood={getVisualPlaceholder(selectedArticle).mood}
                texture={getVisualPlaceholder(selectedArticle).texture}
                gradient={getVisualPlaceholder(selectedArticle).gradient}
                image={getVisualPlaceholder(selectedArticle).image}
              />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-sky-700">
                You are quoting this fabric
              </div>
              <div className="mt-1 font-extrabold" style={{ color: brand.navy }}>
                {selectedArticle.articleName}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {usageSegmentLabels[selectedArticle.usageSegment] || titleize(selectedArticle.usageSegment)}
              </div>
              <div className="mt-3 text-xs leading-5 text-slate-500">
                Fabric type, material, yarn count, and width are prefilled from the selected product card.
              </div>

              <button
                type="button"
                onClick={() => {
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="mt-4 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
              >
                ← Choose another fabric
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="customer_name"
          placeholder="Name *"
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="company_name"
          placeholder="Company"
        />

        <input
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="phone_line"
          placeholder="Phone / LINE *"
        />

   <select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  required
  name="product_raw_name"
  value={selectedFabricStructure}
  onChange={(e) => {
    setSelectedFabricStructure(e.target.value);
    clearSelectedArticle();
  }}
>
  <option value="" disabled>Select knitted fabric type *</option>

  {fabricStructureOptions.map((item) => (
    <option key={item} value={item}>
      {item
  .replaceAll("_", " ")
  .replace(/\b\w/g, (c) => c.toUpperCase())}
    </option>
  ))}

  <option value="not_sure">Not sure / Need recommendation</option>
  <option value="other_knitted_fabric">Other knitted fabric</option>
</select>
<select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  name="material_family"
  value={selectedMaterialFamily}
  onChange={(e) => {
    setSelectedMaterialFamily(e.target.value);
    clearSelectedArticle();
  }}
>
  <option value="">Material / blend</option>
  {materialFamilyOptions.map((item) => (
    <option key={item} value={item}>
      {item.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </option>
  ))}
</select>

<select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  name="yarn_count"
  value={selectedYarnCount}
  onChange={(e) => {
    setSelectedYarnCount(e.target.value);
    clearSelectedArticle();
  }}
>
  <option value="">Yarn count</option>
  {yarnCountOptions.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>

<select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  name="width_inches"
  value={selectedWidthInches}
  onChange={(e) => {
    setSelectedWidthInches(e.target.value);
    clearSelectedArticle();
  }}
>
  <option value="">Width</option>
  {widthOptions.map((item) => (
    <option key={item} value={item}>
      {item}"
    </option>
  ))}
</select>
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="gsm"
          placeholder="GSM"
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="color"
          placeholder="Color"
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          name="quantity_value"
          type="number"
          min="0"
          placeholder="Quantity (KG)"
        />

        <input
          className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none cursor-not-allowed"
          value="KG"
          readOnly
        />

        <select
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:col-span-2"
          name="usage_type"
          defaultValue=""
        >
          <option value="" disabled>Select usage *</option>
          <option>T-shirt production</option>
          <option>Polo shirt production</option>
          <option>Uniform / company shirt</option>
          <option>Fashion brand</option>
          <option>Online seller / small batch</option>
          <option>Garment factory production</option>
          <option>Sample / testing</option>
          <option>Need fabric recommendation</option>
          <option>Other usage</option>
        </select>
      </div>

      <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <summary className="cursor-pointer list-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-700">
                Optional Buyer Details
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Help us recommend suitable fabric options, MOQ, and production planning faster.
              </p>
            </div>
            <span className="mt-1 text-sm font-bold text-sky-600">+</span>
          </div>
        </summary>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            name="monthly_usage_kg"
            type="number"
            min="0"
            placeholder="Monthly usage (KG)"
          />

          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            name="buyer_type"
            defaultValue=""
          >
            <option value="">Buyer type</option>
            <option>Brand</option>
            <option>Garment factory</option>
            <option>Trader</option>
            <option>Reseller</option>
            <option>Print shop</option>
            <option>Other buyer</option>
          </select>

          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            name="target_market"
            defaultValue=""
          >
            <option value="">Target market</option>
            <option>Thailand domestic</option>
            <option>Export</option>
            <option>Online brand</option>
            <option>Corporate uniform</option>
            <option>Streetwear</option>
            <option>Sportswear</option>
          </select>

          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            name="production_stage"
            defaultValue=""
          >
            <option value="">Production stage</option>
            <option>Sampling</option>
            <option>Production ready</option>
            <option>Reorder</option>
            <option>Price checking</option>
            <option>Need recommendation</option>
          </select>

          <textarea
            className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:col-span-2"
            name="sourcing_pain_points"
            placeholder="Sourcing pain points (pricing, MOQ, delivery, color matching, consistency)"
          />
        </div>
      </details>

      <div className="mt-5 mb-2 text-sm font-semibold text-slate-500">
        Additional details (optional)
      </div>

      <textarea
        className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        name="message"
        placeholder="Message / special requirements"
      />

      <p className="mt-4 text-sm leading-6 text-slate-500">
        Not sure which fabric to use yet? No problem.
        Tell us your product idea and our team will recommend
        suitable knitted fabric, GSM and usage — even for
        small quantities or sample production.
      </p>

      <button
        type="submit"
        disabled={submitStatus === "sending"}
        className="mt-6 w-full rounded-full px-7 py-4 font-bold text-white shadow-lg transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: brand.blue }}
      >
        {submitStatus === "sending"
          ? "Sending..."
          : "ส่งคำขอราคา"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Usually responds within business hours via LINE or phone.
      </p>

      {submitStatus === "success" && (
        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
          ส่งคำขอเรียบร้อยแล้ว
          Our team will contact you shortly.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
          Something went wrong: {submitError}
        </div>
      )}
    </form>
  </div>
</section>

  );
}
