import { useEffect, useState } from "react";
import { useProfile } from "../auth/useProfile";
import { supabase } from "../lib/supabaseClient";

const brand = {
  navy: "#123044",
};

export default function AdminBuyersDashboard() {
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
