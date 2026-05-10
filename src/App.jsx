import { useEffect, useState } from "react";
import {
  FABRIC_STRUCTURES,
  MATERIAL_FAMILIES,
  YARN_COUNTS,
  WIDTH_INCHES,
} from "./data/textileEnums";
import { FINISHED_ARTICLES } from "./data/finishedArticles";
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

const buyerTypes = [
  "T-shirts",
  "Uniforms",
  "Fashion Brands",
  "Screen Printing",
  "Sampling",
];

const usageSegmentLabels = {
  collar_cuff: "Collar / cuff",
  general: "General fabric",
  premium_fashion: "Premium fashion",
  tshirt: "T-shirt fabric",
};

const featuredArticles = [...FINISHED_ARTICLES]
  .sort((a, b) => b.linkedProducts - a.linkedProducts)
  .slice(0, 12);

const BUYER_INTENT_STORAGE_KEY = "knitspeed_buyer_intent_events";
const MAX_BUYER_INTENT_EVENTS = 100;

function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getPrimaryWidth(article) {
  return article?.availableWidths?.[0] || "";
}

function readBuyerIntentEvents() {
  try {
    return JSON.parse(localStorage.getItem(BUYER_INTENT_STORAGE_KEY) || "[]");
  } catch (error) {
    console.warn("Could not read buyer intent events:", error);
    return [];
  }
}

function writeBuyerIntentEvent(eventType, article, details = {}) {
  if (!article?.seoSlug) return null;

  const event = {
    event_type: eventType,
    article_name: article.articleName,
    article_slug: article.seoSlug,
    usage_segment: article.usageSegment,
    material_family: article.materialFamily,
    fabric_structure: article.fabricStructure,
    linked_products: article.linkedProducts,
    created_at: new Date().toISOString(),
    ...details,
  };

  const events = readBuyerIntentEvents();
  events.push(event);
  localStorage.setItem(
    BUYER_INTENT_STORAGE_KEY,
    JSON.stringify(events.slice(-MAX_BUYER_INTENT_EVENTS))
  );

  return event;
}

function buildBuyerIntentNote(article) {
  if (!article?.seoSlug) return "";

  const matchingEvents = readBuyerIntentEvents().filter(
    (event) => event.article_slug === article.seoSlug
  );
  const quoteClicks = matchingEvents.filter(
    (event) => event.event_type === "article_quote_click"
  ).length;

  return [
    "Prime intent:",
    article.articleName,
    `slug=${article.seoSlug}`,
    `usage=${article.usageSegment || "unknown"}`,
    `quote_clicks=${quoteClicks}`,
  ].join(" ");
}

function getTopCounts(items, limit = 5) {
  return Object.entries(
    items.reduce((acc, item) => {
      if (!item) return acc;
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}


function AdminLeadsDashboard() {
  const { profile, profileLoading } = useProfile();
  const isOwner = profile?.role === "owner";
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [currentTimeMs] = useState(() => Date.now());

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
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

  const leadStatusStyles = {
    new: "bg-sky-100 text-sky-700",
    contacted: "bg-indigo-100 text-indigo-700",
    quoted: "bg-amber-100 text-amber-700",
    sampling: "bg-purple-100 text-purple-700",
    negotiating: "bg-orange-100 text-orange-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    dead: "bg-slate-200 text-slate-600",
  };

  function getLeadStatusStyle(status) {
    return leadStatusStyles[status] || "bg-slate-100 text-slate-600";
  }

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

  const statusCounts = leadStatuses.reduce((acc, status) => {
    acc[status] = leads.filter((lead) => (lead.lead_status || "new") === status).length;
    return acc;
  }, {});

  const untouchedOver3Days = leads.filter((lead) => {
    if (lead.last_contact_at) return false;
    const createdAt = new Date(lead.created_at);
    const ageDays = (currentTimeMs - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return ageDays > 3;
  }).length;

  const conversionRate =
    leads.length > 0 ? Math.round((confirmedCount / leads.length) * 100) : 0;

  const primeLeads = leads.filter((lead) => (lead.lead_priority || "random") === "prime");
  const primeArticleLeads = primeLeads.filter(
    (lead) => lead.article_name || lead.article_slug
  );
  const topQuotedArticles = getTopCounts(
    primeArticleLeads.map((lead) => lead.article_name || lead.article_slug)
  );
  const topUsageSegments = getTopCounts(
    primeArticleLeads.map((lead) => lead.usage_segment)
  );
  const recentPrimeArticleInquiries = [...primeArticleLeads]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5);

  const filteredLeads = leads.filter((lead) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      !search ||
      (lead.customer_name || "").toLowerCase().includes(search) ||
      (lead.company_name || "").toLowerCase().includes(search) ||
      (lead.fabric_type || "").toLowerCase().includes(search) ||
      (lead.article_name || "").toLowerCase().includes(search) ||
      (lead.article_slug || "").toLowerCase().includes(search) ||
      (lead.usage_segment || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (lead.lead_status || "new") === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      (lead.lead_priority || "random") === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
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


            <div className="mt-4 flex gap-3">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                <option value="all">All Leads</option>
                <option value="prime">Prime Leads</option>
                <option value="random">Random Leads</option>
              </select>
            </div>
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

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total leads</div>
            <div className="mt-2 text-3xl font-extrabold">
              {filteredLeads.length}
            </div>
          </div>

          <div className="rounded-3xl bg-sky-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">New</div>
            <div className="mt-2 text-3xl font-extrabold">
              {statusCounts.new || 0}
            </div>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Quoted</div>
            <div className="mt-2 text-3xl font-extrabold">
              {statusCounts.quoted || 0}
            </div>
          </div>

          <div className="rounded-3xl bg-violet-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Negotiating</div>
            <div className="mt-2 text-3xl font-extrabold">
              {statusCounts.negotiating || 0}
            </div>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Confirmed</div>
            <div className="mt-2 text-3xl font-extrabold">
              {confirmedCount}
            </div>
          </div>

          <div className="rounded-3xl bg-rose-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Dead leads</div>
            <div className="mt-2 text-3xl font-extrabold">
              {statusCounts.dead || 0}
            </div>
          </div>

          <div className="rounded-3xl bg-orange-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Untouched &gt; 3 days</div>
            <div className="mt-2 text-3xl font-extrabold">
              {untouchedOver3Days}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Conversion rate</div>
            <div className="mt-2 text-3xl font-extrabold">
              {conversionRate}%
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total requested KG</div>
            <div className="mt-2 text-3xl font-extrabold">
              {totalRequestedKg}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Hottest fabric</div>
            <div className="mt-2 truncate text-lg font-bold">
              {hottestFabric}
            </div>
          </div>

        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Prime leads</div>
            <div className="mt-2 text-3xl font-extrabold">{primeLeads.length}</div>
            <div className="mt-1 text-xs text-slate-500">
              {leads.length ? `${Math.round((primeLeads.length / leads.length) * 100)}% of loaded leads` : "No leads loaded"}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-slate-500">Top quoted articles</div>
            <div className="space-y-3">
              {topQuotedArticles.length ? (
                topQuotedArticles.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No article quotes yet.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-slate-500">Top usage segments</div>
            <div className="space-y-3">
              {topUsageSegments.length ? (
                topUsageSegments.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">
                      {usageSegmentLabels[item.label] || titleize(item.label)}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No usage segments yet.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-slate-500">Recent Prime article inquiries</div>
            <div className="space-y-3">
              {recentPrimeArticleInquiries.length ? (
                recentPrimeArticleInquiries.map((lead) => (
                  <div key={lead.id || `${lead.created_at}-${lead.article_slug}`} className="text-sm">
                    <div className="font-semibold text-slate-700">
                      {lead.article_name || lead.article_slug}
                    </div>
                    <div className="text-xs text-slate-500">
                      {[lead.customer_name || "Unknown buyer", lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No Prime article inquiries yet.</div>
              )}
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
                      <td className="px-4 py-3">
                        {lead.article_name || lead.fabric_type || lead.product_raw_name || "-"}
                        {lead.article_slug ? (
                          <div className="text-xs text-slate-500">{lead.article_slug}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{lead.material_family || "-"}</td>
                      <td className="px-4 py-3">{lead.width_inches || "-"}</td>
                      <td className="px-4 py-3">
                        {lead.quantity_value ? `${lead.quantity_value} ${lead.quantity_unit || ""}` : "-"}
                      </td>
                      <td className="px-4 py-3">{lead.usage_type || "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          className={`rounded-full px-3 py-1 text-xs font-bold outline-none ${getLeadStatusStyle(lead.lead_status || "new")}`}
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



function AdminBuyersDashboard() {
  const { profile, profileLoading } = useProfile();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [searchText, setSearchText] = useState("");
  const [temperatureFilter, setTemperatureFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const buyerStatuses = ["new", "contacted", "interested", "quoted", "follow_up", "not_fit", "closed"];
  const temperatures = ["hot", "warm", "cold"];

  const temperatureStyles = {
    hot: "bg-rose-100 text-rose-700",
    warm: "bg-amber-100 text-amber-700",
    cold: "bg-slate-100 text-slate-600",
  };

  const statusStyles = {
    new: "bg-sky-100 text-sky-700",
    contacted: "bg-indigo-100 text-indigo-700",
    interested: "bg-emerald-100 text-emerald-700",
    quoted: "bg-amber-100 text-amber-700",
    follow_up: "bg-purple-100 text-purple-700",
    not_fit: "bg-slate-200 text-slate-600",
    closed: "bg-green-100 text-green-700",
  };

  function getTemperatureStyle(value) {
    return temperatureStyles[value] || "bg-slate-100 text-slate-600";
  }

  function getStatusStyle(value) {
    return statusStyles[value] || "bg-slate-100 text-slate-600";
  }

  async function updateBuyerStatus(buyerId, nextStatus) {
    const previousBuyers = buyers;

    setBuyers((current) =>
      current.map((buyer) =>
        buyer.id === buyerId ? { ...buyer, status: nextStatus } : buyer
      )
    );

    const { error } = await supabase
      .from("buyer_targets")
      .update({ status: nextStatus })
      .eq("id", buyerId);

    if (error) {
      console.error("Failed to update buyer status:", error);
      setBuyers(previousBuyers);
      alert("Could not update buyer status. Reverted.");
    }
  }

  async function updateBuyerNotes(buyerId, notes) {
    const previousBuyers = buyers;
    const lastContactAt = notes.trim() ? new Date().toISOString() : null;

    setBuyers((current) =>
      current.map((buyer) =>
        buyer.id === buyerId
          ? { ...buyer, notes, last_contact_at: lastContactAt }
          : buyer
      )
    );

    const { error } = await supabase
      .from("buyer_targets")
      .update({
        notes,
        last_contact_at: lastContactAt,
      })
      .eq("id", buyerId);

    if (error) {
      console.error("Failed to update buyer notes:", error);
      setBuyers(previousBuyers);
      alert("Could not update buyer notes. Reverted.");
    }
  }

  useEffect(() => {
    async function loadBuyers() {
      setLoading(true);
      setErrorText("");

      try {
        if (!supabase) {
          setErrorText("Supabase is not configured.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("buyer_targets")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(300);

        if (error) throw error;

        setBuyers(data || []);
      } catch (error) {
        console.error("Failed to load buyer targets:", error);
        setErrorText(error.message || "Failed to load buyer targets.");
      } finally {
        setLoading(false);
      }
    }

    loadBuyers();
  }, []);

  const platforms = Array.from(
    new Set(buyers.map((buyer) => buyer.platform).filter(Boolean))
  ).sort();

  const totalBuyers = buyers.length;
  const hotCount = buyers.filter((buyer) => buyer.lead_temperature === "hot").length;
  const warmCount = buyers.filter((buyer) => buyer.lead_temperature === "warm").length;
  const coldCount = buyers.filter((buyer) => buyer.lead_temperature === "cold").length;
  const contactedCount = buyers.filter((buyer) => buyer.status && buyer.status !== "new").length;

  const filteredBuyers = buyers.filter((buyer) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      !search ||
      (buyer.company_name || "").toLowerCase().includes(search) ||
      (buyer.contact_name || "").toLowerCase().includes(search) ||
      (buyer.phone || "").toLowerCase().includes(search) ||
      (buyer.line_id || "").toLowerCase().includes(search) ||
      (buyer.business_type || "").toLowerCase().includes(search) ||
      (buyer.product_focus || "").toLowerCase().includes(search) ||
      (buyer.province || "").toLowerCase().includes(search);

    const matchesTemperature =
      temperatureFilter === "all" || buyer.lead_temperature === temperatureFilter;

    const matchesPlatform =
      platformFilter === "all" || buyer.platform === platformFilter;

    const matchesStatus =
      statusFilter === "all" || (buyer.status || "new") === statusFilter;

    return matchesSearch && matchesTemperature && matchesPlatform && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: brand.navy }}>
              Knitspeed Buyer Intelligence
            </h1>

            <div className="mt-1 text-sm text-slate-500">
              {profileLoading
                ? "Loading profile..."
                : `${profile?.full_name || "User"} (${profile?.role || "unknown"})`}
            </div>
            <p className="mt-1 text-slate-500">
              Outbound acquisition console for scraped and classified buyer targets.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin/buyers"
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Buyers Console
            </a>
            <a
              href="/admin/leads"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-100"
              title="Inbound leads are kept secondary for now"
            >
              Inbound Leads
            </a>
            <a
              href="/"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100"
            >
              Back to website
            </a>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total buyers</div>
            <div className="mt-2 text-3xl font-extrabold">{totalBuyers}</div>
          </div>

          <div className="rounded-3xl bg-rose-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Hot</div>
            <div className="mt-2 text-3xl font-extrabold">{hotCount}</div>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Warm</div>
            <div className="mt-2 text-3xl font-extrabold">{warmCount}</div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Cold</div>
            <div className="mt-2 text-3xl font-extrabold">{coldCount}</div>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Touched</div>
            <div className="mt-2 text-3xl font-extrabold">{contactedCount}</div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search company, phone, LINE, product, province..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 md:col-span-2"
          />

          <select
            value={temperatureFilter}
            onChange={(e) => setTemperatureFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          >
            <option value="all">All temperatures</option>
            {temperatures.map((temperature) => (
              <option key={temperature} value={temperature}>
                {temperature}
              </option>
            ))}
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          >
            <option value="all">All platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          >
            <option value="all">All statuses</option>
            {buyerStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-slate-500">Loading buyer targets...</div>
          ) : errorText ? (
            <div className="p-6 text-red-600">{errorText}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Product focus</th>
                    <th className="px-4 py-3">Province</th>
                    <th className="px-4 py-3">Temp</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBuyers.map((buyer) => (
                    <tr key={buyer.id || buyer.company_name} className="hover:bg-sky-50/40">
                      <td className="px-4 py-3 font-semibold">
                        {buyer.company_name || "-"}
                        {buyer.website ? (
                          <div>
                            <a
                              href={buyer.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-normal text-sky-600 underline"
                            >
                              website
                            </a>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <div>{buyer.contact_name || "-"}</div>
                        <div className="text-xs text-slate-500">{buyer.phone || buyer.line_id || ""}</div>
                      </td>
                      <td className="px-4 py-3">{buyer.platform || "-"}</td>
                      <td className="px-4 py-3">{buyer.business_type || "-"}</td>
                      <td className="px-4 py-3">{buyer.product_focus || "-"}</td>
                      <td className="px-4 py-3">{buyer.province || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getTemperatureStyle(buyer.lead_temperature)}`}>
                          {buyer.lead_temperature || "cold"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className={`rounded-full px-3 py-1 text-xs font-bold outline-none ${getStatusStyle(buyer.status || "new")}`}
                          value={buyer.status || "new"}
                          onChange={(e) => updateBuyerStatus(buyer.id, e.target.value)}
                          disabled={!buyer.id}
                        >
                          {buyerStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="min-w-64 px-4 py-3">
                        <textarea
                          value={buyer.notes || ""}
                          onChange={(e) => updateBuyerNotes(buyer.id, e.target.value)}
                          placeholder="Call notes..."
                          className="h-16 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!filteredBuyers.length ? (
                <div className="p-6 text-slate-500">No buyer targets match current filters.</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



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

      <section id="products" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: brand.navy }}>Finished Articles</h2>
            <p className="mt-3 text-slate-600">Buyer-facing fabric articles mapped from current production data.</p>
          </div>
          <a href="#quote" className="font-bold text-sky-600">Request custom GSM / color →</a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <article
              key={article.articleId}
              data-article-slug={article.seoSlug}
              className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
            >
              <div className="flex min-h-32 flex-col justify-between p-6" style={{ background: `linear-gradient(135deg, ${brand.paleBlue}, #fff)` }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm">
                    {usageSegmentLabels[article.usageSegment] || titleize(article.usageSegment)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {article.linkedProducts} SKU{article.linkedProducts === 1 ? "" : "s"}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold leading-snug" style={{ color: brand.navy }}>
                  {article.articleName}
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{titleize(article.materialFamily)}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{titleize(article.fabricStructure)}</span>
                  {article.yarnCount ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1">{article.yarnCount}s</span>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {article.availableWidths.length
                    ? `Available widths: ${article.availableWidths.slice(0, 4).join('", ')}"`
                    : "Width options confirmed after inquiry."}
                </p>
                <button
                  type="button"
                  onClick={() => handleArticleSelect(article)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: brand.blue }}
                >
                  Quote this article <ArrowRight size={16} />
                </button>
              </div>
            </article>
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
        <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-wide text-sky-700">
            Selected article
          </div>
          <div className="mt-1 font-extrabold" style={{ color: brand.navy }}>
            {selectedArticle.articleName}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {usageSegmentLabels[selectedArticle.usageSegment] || titleize(selectedArticle.usageSegment)}
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
