import React, { useEffect, useState } from "react";
import {
  FABRIC_STRUCTURES,
  MATERIAL_FAMILIES,
  YARN_COUNTS,
  WIDTH_INCHES,
} from "./data/textileEnums";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import { useProfile } from "./auth/useProfile";
import { supabase } from "./lib/supabaseClient";
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Factory,
  Clock,
  Shirt,
  Package,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const brand = {
  blue: "#3FA9D5",
  deepBlue: "#2F8FBF",
  paleBlue: "#E6F4FB",
  iceBlue: "#F4FBFF",
  navy: "#123044",
};

const fabrics = [
  {
    title: "Cotton Combed #20",
    desc: "Thicker, durable, ideal for oversize tees, uniforms and screen printing.",
    gsm: "180–220 GSM",
  },
  {
    title: "Cotton Combed #30",
    desc: "Soft, breathable, versatile fabric for everyday T-shirts and fashion brands.",
    gsm: "140–170 GSM",
  },
  {
    title: "Cotton #40 Interlock",
    desc: "Premium smooth surface, balanced weight, holds shape and feels refined.",
    gsm: "160–180 GSM",
  },
];

const buyerTypes = [
  "T-shirts",
  "Uniforms",
  "Fashion Brands",
  "Screen Printing",
  "Sampling",
];


function AdminLeadsDashboard() {
  const { profile, profileLoading } = useProfile();
  const isOwner = profile?.role === "owner";
  const isStaff = profile?.role === "staff";
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const leadStatuses = [
    "new",
    "contacted",
    "quoted",
    "sampling",
    "negotiating",
    "confirmed",
    "dead",
  ];

  async function updateLeadStatus(leadId, nextStatus) {
    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, lead_status: nextStatus } : lead
      )
    );

    const { error } = await supabase
      .from("quote_leads")
      .update({ lead_status: nextStatus })
      .eq("id", leadId);

    if (error) {
      console.error("Failed to update lead status:", error);
      setLeads(previousLeads);
      alert("Could not update lead status. Reverted.");
    }
  }

  function exportLeadsCsv() {
    if (!isOwner) {
      alert("Export is restricted to owner account.");
      return;
    }
    const columns = [
      "created_at",
      "customer_name",
      "company_name",
      "phone_line",
      "fabric_type",
      "product_raw_name",
      "material_family",
      "yarn_count",
      "width_inches",
      "gsm",
      "color",
      "quantity_value",
      "quantity_unit",
      "usage_type",
      "lead_status",
      "message",
    ];

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return "";
      const text = String(value).replaceAll('"', '""');
      return `"${text}"`;
    };

    const csv = [
      columns.join(","),
      ...leads.map((lead) => columns.map((column) => escapeCsv(lead[column])).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `knitspeed_leads_${date}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  const fabricCounts = {};

  leads.forEach((lead) => {
    const fabric = lead.fabric_type || "unknown";
    fabricCounts[fabric] = (fabricCounts[fabric] || 0) + 1;
  });

  const hottestFabric =
    Object.entries(fabricCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const totalRequestedKg = leads.reduce((sum, lead) => {
    return sum + (Number(lead.quantity_value) || 0);
  }, 0);

  const confirmedCount = leads.filter(
    (lead) => lead.lead_status === "confirmed"
  ).length;

  const samplingCount = leads.filter(
    (lead) => lead.lead_status === "sampling"
  ).length;

  const filteredLeads = leads.filter((lead) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      !search ||
      (lead.customer_name || "").toLowerCase().includes(search) ||
      (lead.company_name || "").toLowerCase().includes(search) ||
      (lead.fabric_type || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (lead.lead_status || "new") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    async function loadLeads() {
      setLoading(true);
      setErrorText("");

      try {
        if (!supabase) {
          setErrorText("Supabase is not configured.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("quote_leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        setLeads(data || []);
      } catch (error) {
        console.error("Failed to load leads:", error);
        setErrorText(error.message || "Failed to load leads.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: brand.navy }}>
              Knitspeed Lead Dashboard
            </h1>

            <div className="text-sm text-slate-500 mt-1">
              {profileLoading
                ? "Loading profile..."
                : `${profile?.full_name || "User"} (${profile?.role || "unknown"})`}
            </div>
            <p className="mt-1 text-slate-500">
              Internal view of quote requests from the website.
            </p>
          </div>

          <div className="flex gap-3">
            {isOwner ? (
              <button
                type="button"
                onClick={exportLeadsCsv}
                disabled={!leads.length}
                className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV
              </button>
            ) : (
              <span className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-500">
                Export restricted
              </span>
            )}

            <a
              href="/"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100"
            >
              Back to website
            </a>
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total leads</div>
            <div className="mt-2 text-3xl font-extrabold">{filteredLeads.length}</div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">New</div>
            <div className="mt-2 text-3xl font-extrabold">
              {leads.filter((lead) => lead.lead_status === "new").length}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">With quantity</div>
            <div className="mt-2 text-3xl font-extrabold">
              {leads.filter((lead) => lead.quantity_value).length}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Hottest fabric</div>
            <div className="mt-2 truncate text-lg font-bold">
              {hottestFabric}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total requested KG</div>
            <div className="mt-2 text-3xl font-extrabold">
              {totalRequestedKg}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Confirmed leads</div>
            <div className="mt-2 text-3xl font-extrabold">
              {confirmedCount}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Sampling leads</div>
            <div className="mt-2 text-3xl font-extrabold">
              {samplingCount}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search customer, company, fabric..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          >
            <option value="all">All statuses</option>
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-slate-500">Loading leads...</div>
          ) : errorText ? (
            <div className="p-6 text-red-600">{errorText}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Phone / LINE</th>
                    <th className="px-4 py-3">Fabric</th>
                    <th className="px-4 py-3">Material</th>
                    <th className="px-4 py-3">Width</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Usage</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id || lead.created_at} className="hover:bg-sky-50/40">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {lead.customer_name || "-"}
                        <div className="text-xs font-normal text-slate-500">{lead.company_name || ""}</div>
                      </td>
                      <td className="px-4 py-3">{lead.phone_line || "-"}</td>
                      <td className="px-4 py-3">{lead.fabric_type || lead.product_raw_name || "-"}</td>
                      <td className="px-4 py-3">{lead.material_family || "-"}</td>
                      <td className="px-4 py-3">{lead.width_inches || "-"}</td>
                      <td className="px-4 py-3">
                        {lead.quantity_value ? `${lead.quantity_value} ${lead.quantity_unit || ""}` : "-"}
                      </td>
                      <td className="px-4 py-3">{lead.usage_type || "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 outline-none"
                          value={lead.lead_status || "new"}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          disabled={!lead.id}
                        >
                          {leadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


export default function App() {
  if (window.location.pathname === "/login") {
    return (
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  }

  if (window.location.pathname === "/admin/leads") {
    return (
      <AuthProvider>
        <ProtectedRoute>
          <AdminLeadsDashboard />
        </ProtectedRoute>
      </AuthProvider>
    );
  }

  const [submitStatus, setSubmitStatus] = useState("");
  const [submitError, setSubmitError] = useState("");

  async function handleQuoteSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    setSubmitStatus("sending");
    setSubmitError("");

    const form = new FormData(formEl);

    const payload = {
      business_unit: "Knitspeed",
      lead_status: "new",
      customer_name: form.get("customer_name") || "",
      company_name: form.get("company_name") || "",
      phone_line: form.get("phone_line") || "",
      product_raw_name: form.get("product_raw_name") || "",
      fabric_type: form.get("product_raw_name") || "knitted",
      material_family: form.get("material_family") || "",
      yarn_count: form.get("yarn_count") || "",
      width_inches: form.get("width_inches") || "",
      gsm: form.get("gsm") || "",
      color: form.get("color") || "",
      quantity_value: form.get("quantity_value") ? Number(form.get("quantity_value")) : null,
      quantity_unit: form.get("quantity_unit") || "kg",
      usage_type: form.get("usage_type") || "",
      message: form.get("message") || "",
    };

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

      <section id="products" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: brand.navy }}>Featured Fabrics</h2>
            <p className="mt-3 text-slate-600">Start with the core products buyers understand quickly.</p>
          </div>
          <a href="#quote" className="font-bold text-sky-600">Request custom GSM / color →</a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {fabrics.map((f) => (
            <div key={f.title} className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100">
              <div className="h-36" style={{ background: `linear-gradient(135deg, ${brand.paleBlue}, #fff)` }} />
              <div className="p-6">
                <div className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">{f.gsm}</div>
                <h3 className="text-xl font-extrabold" style={{ color: brand.navy }}>{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <section id="quote" className="py-16" style={{ backgroundColor: brand.iceBlue }}>
  <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2">
    <div>
      <h2
        className="text-3xl font-extrabold md:text-4xl"
        style={{ color: brand.navy }}
      >
        Request a Fabric Quote
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
  defaultValue=""
>
  <option value="" disabled>Select knitted fabric type *</option>

  {FABRIC_STRUCTURES.map((item) => (
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
  defaultValue=""
>
  <option value="">Material / blend</option>
  {MATERIAL_FAMILIES.map((item) => (
    <option key={item} value={item}>
      {item.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </option>
  ))}
</select>

<select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  name="yarn_count"
  defaultValue=""
>
  <option value="">Yarn count</option>
  {YARN_COUNTS.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>

<select
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
  name="width_inches"
  defaultValue=""
>
  <option value="">Width</option>
  {WIDTH_INCHES.map((item) => (
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
          : "Submit Quote Request"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Usually responds within business hours via LINE or phone.
      </p>

      {submitStatus === "success" && (
        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
          Quote request sent successfully.
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
