import { useEffect, useState } from "react";
import {
  FABRIC_STRUCTURES,
  MATERIAL_FAMILIES,
  YARN_COUNTS,
  WIDTH_INCHES,
} from "./data/textileEnums";
import { FINISHED_ARTICLES } from "./data/finishedArticles";
import { FEATURED_ARTICLE_SLUGS } from "./data/featuredArticleSlugs";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import AdminLeadsDashboard from "./pages/AdminLeadsDashboard";
import AdminBuyersDashboard from "./pages/AdminBuyersDashboard";
import QuoteForm from "./components/QuoteForm";
import FinishedArticleGrid from "./components/articles/FinishedArticleGrid";
import { supabase } from "./lib/supabaseClient";
import { buildBuyerIntentNote, writeBuyerIntentEvent } from "./lib/buyerIntent";
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Factory,
  Clock,
  Shirt,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const brand = {
  blue: "#3FA9D5",
  deepBlue: "#2F8FBF",
  paleBlue: "#E6F4FB",
  iceBlue: "#F4FBFF",
  navy: "#123044",
};

const buyerTypes = [
  "T-shirts",
  "Uniforms",
  "Fashion Brands",
  "Screen Printing",
  "Sampling",
];

function getPrimaryWidth(article) {
  return article?.availableWidths?.[0] || "";
}

function getFeaturedArticles() {
  const articleBySlug = new Map(
    FINISHED_ARTICLES.map((article) => [article.seoSlug, article])
  );
  const curatedArticles = FEATURED_ARTICLE_SLUGS.map((slug) =>
    articleBySlug.get(slug)
  ).filter(Boolean);

  if (curatedArticles.length) {
    return curatedArticles;
  }

  return [...FINISHED_ARTICLES]
    .sort((a, b) => b.linkedProducts - a.linkedProducts)
    .slice(0, 12);
}

const featuredArticles = getFeaturedArticles();


export default function App() {
  const pathname = window.location.pathname;
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedFabricStructure, setSelectedFabricStructure] = useState("");
  const [selectedMaterialFamily, setSelectedMaterialFamily] = useState("");
  const [selectedYarnCount, setSelectedYarnCount] = useState("");
  const [selectedWidthInches, setSelectedWidthInches] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;

    featuredArticles.forEach((article, position) => {
      writeBuyerIntentEvent("article_impression", article, {
        position: position + 1,
      });
    });
  }, [pathname]);

  function handleArticleSelect(article) {
    writeBuyerIntentEvent("article_quote_click", article);

    setSelectedArticle(article);
    setSelectedFabricStructure(article.fabricStructure || "");
    setSelectedMaterialFamily(article.materialFamily || "");
    setSelectedYarnCount(article.yarnCount || "");
    setSelectedWidthInches(getPrimaryWidth(article));

    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  }

  function clearSelectedArticle() {
    setSelectedArticle(null);
  }

  const fabricStructureOptions = Array.from(
    new Set([...FABRIC_STRUCTURES, selectedFabricStructure].filter(Boolean))
  );
  const materialFamilyOptions = Array.from(
    new Set([...MATERIAL_FAMILIES, selectedMaterialFamily].filter(Boolean))
  );
  const yarnCountOptions = Array.from(
    new Set([...YARN_COUNTS, selectedYarnCount].filter(Boolean))
  );
  const widthOptions = Array.from(
    new Set([...WIDTH_INCHES.map(String), selectedWidthInches].filter(Boolean))
  );

  if (pathname === "/login") {
    return (
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  }

  if (pathname === "/admin/leads") {
    return (
      <AuthProvider>
        <ProtectedRoute>
          <AdminLeadsDashboard />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  if (pathname === "/admin/buyers") {
    return (
      <AuthProvider>
        <ProtectedRoute>
          <AdminBuyersDashboard />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  async function handleQuoteSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    setSubmitStatus("sending");
    setSubmitError("");

    const form = new FormData(formEl);
    const userMessage = form.get("message") || "";
    const buyerIntentNote = buildBuyerIntentNote(selectedArticle);
    const message = [userMessage, buyerIntentNote].filter(Boolean).join("\n\n");

    const payload = {
      business_unit: "Knitspeed",
      lead_status: "new",
      customer_name: form.get("customer_name") || "",
      company_name: form.get("company_name") || "",
      phone_line: form.get("phone_line") || "",
      product_raw_name: form.get("product_raw_name") || "",
      fabric_type: form.get("product_raw_name") || "knitted",

      // Prime Engine metadata
      inquiry_source: form.get("inquiry_source") || "homepage_quote_form",
      lead_priority: form.get("lead_priority") || "prime",
      article_name: form.get("article_name") || form.get("product_raw_name") || "",
      article_slug: form.get("article_slug") || "",
      usage_segment: form.get("usage_segment") || "",

      material_family: form.get("material_family") || "",
      yarn_count: form.get("yarn_count") || "",
      width_inches: form.get("width_inches") || "",
      gsm: form.get("gsm") || "",
      color: form.get("color") || "",
      quantity_value: form.get("quantity_value") ? Number(form.get("quantity_value")) : null,
      quantity_unit: form.get("quantity_unit") || "kg",
      usage_type: form.get("usage_type") || "",
      monthly_usage_kg: form.get("monthly_usage_kg") ? Number(form.get("monthly_usage_kg")) : null,
      buyer_type: form.get("buyer_type") || "",
      target_market: form.get("target_market") || "",
      production_stage: form.get("production_stage") || "",
      sourcing_pain_points: form.get("sourcing_pain_points") || "",
      message,
    };

    writeBuyerIntentEvent("article_quote_submit", selectedArticle, {
      quantity_value: payload.quantity_value,
      quantity_unit: payload.quantity_unit,
      usage_type: payload.usage_type,
    });

    try {
      const { error } = supabase ? await supabase.from("quote_leads").insert([payload]) : { error: new Error("Supabase not configured") };

      if (error) {
        console.warn("Supabase unavailable, saving local lead only:", error);
      }
    } catch (error) {
      console.warn("Supabase network unavailable, saving local lead only:", error);
    }

    const localLeads = JSON.parse(localStorage.getItem("knitspeed_quote_leads") || "[]");
    localLeads.push({ ...payload, created_at: new Date().toISOString() });
    localStorage.setItem("knitspeed_quote_leads", JSON.stringify(localLeads));

    formEl.reset();
    setSelectedArticle(null);
    setSelectedFabricStructure("");
    setSelectedMaterialFamily("");
    setSelectedYarnCount("");
    setSelectedWidthInches("");
    setSubmitStatus("success");

    setTimeout(() => {
      setSubmitStatus("");
    }, 4000);
  }

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: brand.blue }}
            >
              KS
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight" style={{ color: brand.navy }}>
                Knitspeed
              </div>
              <div className="text-xs text-slate-500">Premium Knitted Fabric Supplier</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#products" className="hover:text-sky-600">Products</a>
            <a href="#why" className="hover:text-sky-600">Why Us</a>
            <a href="#quote" className="hover:text-sky-600">Quote</a>
            <a href="#contact" className="hover:text-sky-600">Contact</a>
          </nav>

          <a
            href="#quote"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: brand.blue }}
          >
            Get Quote
          </a>
        </div>
      </header>

      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand.iceBlue}, #ffffff 55%, ${brand.paleBlue})`,
        }}
      >
        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute bottom-[-150px] left-[-120px] h-96 w-96 rounded-full bg-cyan-100/80 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-5 inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
              Trusted fabric partner since 2015
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl" style={{ color: brand.navy }}>
              Premium Knitted Fabric Supplier in Thailand
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Cotton / CVC / TC / Jersey / Rib / Interlock. Engineered from real production experience.
              Delivered on spec. Delivered on time.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-white shadow-lg transition hover:translate-y-[-1px]"
                style={{ backgroundColor: brand.blue }}
              >
                Get Fabric Quote <ArrowRight size={18} />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-7 py-4 font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
              >
                <MessageCircle size={18} /> Chat on LINE
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-sky-100">
              <div className="aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-white to-cyan-100 p-6">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <Factory className="mb-4 text-sky-500" size={32} />
                    <div className="text-2xl font-extrabold" style={{ color: brand.navy }}>Production</div>
                    <p className="mt-2 text-sm text-slate-500">Knitting + dyeing expertise</p>
                  </div>

                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <Package className="mb-4 text-sky-500" size={32} />
                    <div className="text-2xl font-extrabold" style={{ color: brand.navy }}>Roll + KG</div>
                    <p className="mt-2 text-sm text-slate-500">Wholesale and small lot</p>
                  </div>

                  <div className="col-span-2 rounded-3xl p-6 text-white shadow-sm" style={{ backgroundColor: brand.blue }}>
                    <div className="text-3xl font-extrabold">Cotton Combed Compact</div>
                    <p className="mt-2 text-sky-50">Soft • Breathable • Durable • Premium hand feel</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold" style={{ color: brand.navy }}>What are you making?</h2>
          <p className="mt-3 text-slate-600">Tell us your use. We help recommend the right fabric.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {buyerTypes.map((item) => (
            <div key={item} className="rounded-3xl border border-sky-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100">
              <Shirt className="mx-auto mb-3 text-sky-500" />
              <div className="font-bold" style={{ color: brand.navy }}>{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="py-16" style={{ backgroundColor: brand.iceBlue }}>
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: brand.navy }}>
                We don’t just sell fabric. We understand production.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                With experience from knitting and dyeing factories, Knitspeed focuses on yarn quality,
                fabric structure, shrinkage control, consistency and delivery timing.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Premium cotton selection",
                "Real production expertise",
                "On-time delivery",
                "Customer-focused support",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white p-5 shadow-sm">
                  <CheckCircle2 className="mb-3 text-sky-500" />
                  <div className="font-bold" style={{ color: brand.navy }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinishedArticleGrid
        articles={featuredArticles}
        brand={brand}
        onArticleSelect={handleArticleSelect}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-[2rem] p-8 md:p-12" style={{ backgroundColor: brand.paleBlue }}>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold" style={{ color: brand.navy }}>Buy Fabric by KG</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Small orders available for startup brands, sampling, test production and urgent top-up stock.
                No need to commit to full rolls first.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <Clock className="mb-3 text-sky-500" />
              <div className="text-xl font-bold" style={{ color: brand.navy }}>
                Fast inquiry. Clear quote. Better production decisions.
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteForm
        brand={brand}
        clearSelectedArticle={clearSelectedArticle}
        fabricStructureOptions={fabricStructureOptions}
        handleQuoteSubmit={handleQuoteSubmit}
        materialFamilyOptions={materialFamilyOptions}
        selectedArticle={selectedArticle}
        selectedFabricStructure={selectedFabricStructure}
        selectedMaterialFamily={selectedMaterialFamily}
        selectedWidthInches={selectedWidthInches}
        selectedYarnCount={selectedYarnCount}
        setSelectedFabricStructure={setSelectedFabricStructure}
        setSelectedMaterialFamily={setSelectedMaterialFamily}
        setSelectedWidthInches={setSelectedWidthInches}
        setSelectedYarnCount={setSelectedYarnCount}
        submitError={submitError}
        submitStatus={submitStatus}
        widthOptions={widthOptions}
        yarnCountOptions={yarnCountOptions}
      />
      <footer id="contact" className="bg-slate-900 px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-2xl font-extrabold">Knitspeed</div>
            <p className="mt-2 text-slate-300">Premium knitted fabric supplier in Thailand.</p>
          </div>
          <div className="text-sm text-slate-300">
            www.knitspeed.com • Facebook: Knitspeed • 090-912-4154
          </div>
        </div>
      </footer>
    </main>
  );
}
