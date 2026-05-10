import { useEffect, useState } from "react";
import { useProfile } from "../auth/useProfile";
import { supabase } from "../lib/supabaseClient";
import { getTopCounts, scorePrimeLead } from "../lib/leadInsights";
import { titleize, usageSegmentLabels } from "../lib/textileLabels";

const brand = {
  navy: "#123044",
};

const scoreTierStyles = {
  Hot: "bg-rose-100 text-rose-700",
  Warm: "bg-amber-100 text-amber-700",
  Watch: "bg-slate-100 text-slate-600",
};

export default function AdminLeadsDashboard() {
  const { profile, profileLoading } = useProfile();
  const isOwner = profile?.role === "owner";
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [currentTimeMs] = useState(() => Date.now());

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workflowFilter, setWorkflowFilter] = useState("all");

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

  function isClosedLead(lead) {
    return ["confirmed", "dead"].includes(lead.lead_status || "new");
  }

  function getFollowupState(lead) {
    if (!lead.next_followup_at || isClosedLead(lead)) return "none";

    const followupAt = new Date(lead.next_followup_at).getTime();
    if (Number.isNaN(followupAt)) return "none";

    return followupAt <= currentTimeMs ? "due" : "scheduled";
  }

  function toDatetimeLocalValue(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
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

  async function updateLeadAction(leadId, changes) {
    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, ...changes } : lead
      )
    );

    const { error } = await supabase
      .from("quote_leads")
      .update(changes)
      .eq("id", leadId);

    if (error) {
      console.error("Failed to update lead action fields:", error);
      setLeads(previousLeads);
      alert("Could not update lead workflow fields. Reverted.");
    }
  }

  function updateLeadOwner(leadId, assignedOwner) {
    updateLeadAction(leadId, { assigned_owner: assignedOwner.trim() || null });
  }

  function updateLeadFollowup(leadId, nextFollowupValue) {
    updateLeadAction(leadId, {
      next_followup_at: nextFollowupValue
        ? new Date(nextFollowupValue).toISOString()
        : null,
    });
  }

  function updateLeadNotes(leadId, salesNotes) {
    updateLeadAction(leadId, {
      sales_notes: salesNotes,
      last_contact_at: salesNotes.trim() ? new Date().toISOString() : null,
    });
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
      "monthly_usage_kg",
      "buyer_type",
      "target_market",
      "production_stage",
      "sourcing_pain_points",
      "lead_status",
      "assigned_owner",
      "next_followup_at",
      "last_contact_at",
      "sales_notes",
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
  const dueFollowups = leads.filter((lead) => getFollowupState(lead) === "due").length;
  const unassignedOpenLeads = leads.filter(
    (lead) => !isClosedLead(lead) && !lead.assigned_owner
  ).length;

  const conversionRate =
    leads.length > 0 ? Math.round((confirmedCount / leads.length) * 100) : 0;

  const primeLeads = leads.filter((lead) => (lead.lead_priority || "random") === "prime");
  const scoredLeads = leads.map((lead) => ({
    ...lead,
    primeScore: scorePrimeLead(lead),
  }));
  const hotPrimeLeads = scoredLeads.filter((lead) => lead.primeScore.tier === "Hot");
  const topScoredPrimeLeads = [...scoredLeads]
    .filter((lead) => (lead.lead_priority || "random") === "prime")
    .sort((a, b) => b.primeScore.score - a.primeScore.score)
    .slice(0, 5);
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

  const filteredLeads = scoredLeads.filter((lead) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      !search ||
      (lead.customer_name || "").toLowerCase().includes(search) ||
      (lead.company_name || "").toLowerCase().includes(search) ||
      (lead.fabric_type || "").toLowerCase().includes(search) ||
      (lead.article_name || "").toLowerCase().includes(search) ||
      (lead.article_slug || "").toLowerCase().includes(search) ||
      (lead.usage_segment || "").toLowerCase().includes(search) ||
      (lead.buyer_type || "").toLowerCase().includes(search) ||
      (lead.target_market || "").toLowerCase().includes(search) ||
      (lead.production_stage || "").toLowerCase().includes(search) ||
      (lead.sourcing_pain_points || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (lead.lead_status || "new") === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      (lead.lead_priority || "random") === priorityFilter;

    const leadWorkflowState = getFollowupState(lead);
    const matchesWorkflow =
      workflowFilter === "all" ||
      (workflowFilter === "needs_followup" && leadWorkflowState === "due") ||
      (workflowFilter === "scheduled_followup" && leadWorkflowState === "scheduled") ||
      (workflowFilter === "untouched_3_days" && !lead.last_contact_at && !isClosedLead(lead) && (() => {
        const createdAt = new Date(lead.created_at);
        const ageDays = (currentTimeMs - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return ageDays > 3;
      })()) ||
      (workflowFilter === "unassigned" && !isClosedLead(lead) && !lead.assigned_owner);

    return matchesSearch && matchesStatus && matchesPriority && matchesWorkflow;
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

          <div className="rounded-3xl bg-fuchsia-50 p-5 shadow-sm">
            <div className="text-sm text-slate-500">Follow-ups due</div>
            <div className="mt-2 text-3xl font-extrabold">
              {dueFollowups}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Unassigned open</div>
            <div className="mt-2 text-3xl font-extrabold">
              {unassignedOpenLeads}
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

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Hot Prime leads</div>
            <div className="mt-2 text-3xl font-extrabold">{hotPrimeLeads.length}</div>
            <div className="mt-1 text-xs text-slate-500">
              Score 70+ from current lead data
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-3 text-sm text-slate-500">Top Prime lead scores</div>
            <div className="space-y-3">
              {topScoredPrimeLeads.length ? (
                topScoredPrimeLeads.map((lead) => (
                  <div key={lead.id || `${lead.created_at}-${lead.customer_name}`} className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-slate-700">
                        {lead.customer_name || "Unknown buyer"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {lead.primeScore.reasons.slice(0, 3).join(" · ") || "No score reasons yet"}
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${scoreTierStyles[lead.primeScore.tier]}`}>
                      {lead.primeScore.tier} {lead.primeScore.score}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">No Prime scores yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search customer, company, fabric..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 md:col-span-2"
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

          <select
            value={workflowFilter}
            onChange={(e) => setWorkflowFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
          >
            <option value="all">All workflows</option>
            <option value="needs_followup">Needs follow-up</option>
            <option value="scheduled_followup">Scheduled follow-up</option>
            <option value="untouched_3_days">Untouched &gt; 3 days</option>
            <option value="unassigned">Unassigned open</option>
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
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Notes</th>
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
                        {lead.buyer_type || lead.target_market ? (
                          <div className="mt-1 text-xs font-normal text-slate-500">
                            {[lead.buyer_type, lead.target_market].filter(Boolean).join(" · ")}
                          </div>
                        ) : null}
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
                      <td className="px-4 py-3">
                        {lead.usage_type || "-"}
                        {lead.monthly_usage_kg ? (
                          <div className="text-xs text-slate-500">
                            Monthly: {lead.monthly_usage_kg} kg
                          </div>
                        ) : null}
                        {lead.production_stage ? (
                          <div className="text-xs text-slate-500">{lead.production_stage}</div>
                        ) : null}
                        {lead.sourcing_pain_points ? (
                          <div className="max-w-56 truncate text-xs text-slate-500">
                            {lead.sourcing_pain_points}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${scoreTierStyles[lead.primeScore.tier]}`}>
                          {lead.primeScore.tier} {lead.primeScore.score}
                        </span>
                        <div className="mt-1 max-w-40 text-xs text-slate-500">
                          {lead.primeScore.reasons.slice(0, 2).join(" · ") || "-"}
                        </div>
                      </td>
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
                      <td className="min-w-64 px-4 py-3">
                        <div className="space-y-2">
                          <input
                            type="text"
                            defaultValue={lead.assigned_owner || ""}
                            placeholder="Owner"
                            onBlur={(e) => {
                              if (e.target.value !== (lead.assigned_owner || "")) {
                                updateLeadOwner(lead.id, e.target.value);
                              }
                            }}
                            disabled={!lead.id}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50"
                          />
                          <input
                            type="datetime-local"
                            defaultValue={toDatetimeLocalValue(lead.next_followup_at)}
                            onBlur={(e) => {
                              if (e.target.value !== toDatetimeLocalValue(lead.next_followup_at)) {
                                updateLeadFollowup(lead.id, e.target.value);
                              }
                            }}
                            disabled={!lead.id}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50"
                          />
                          {getFollowupState(lead) === "due" ? (
                            <div className="text-xs font-semibold text-rose-600">Follow-up due</div>
                          ) : getFollowupState(lead) === "scheduled" ? (
                            <div className="text-xs font-semibold text-slate-500">Follow-up scheduled</div>
                          ) : null}
                        </div>
                      </td>
                      <td className="min-w-72 px-4 py-3">
                        <textarea
                          defaultValue={lead.sales_notes || ""}
                          placeholder="Internal sales notes..."
                          rows={3}
                          onBlur={(e) => {
                            if (e.target.value !== (lead.sales_notes || "")) {
                              updateLeadNotes(lead.id, e.target.value);
                            }
                          }}
                          disabled={!lead.id}
                          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50"
                        />
                        {lead.last_contact_at ? (
                          <div className="mt-1 text-xs text-slate-400">
                            Last touched: {new Date(lead.last_contact_at).toLocaleString()}
                          </div>
                        ) : null}
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
