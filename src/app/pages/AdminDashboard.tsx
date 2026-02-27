import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Shield,
  LogOut,
  Search,
  Filter,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Users,
  FileText,
  X,
  Save,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  Banknote,
  Bitcoin,
} from "lucide-react";
import {
  getComplaints,
  updateComplaint,
  type Complaint,
  type CaseStatus,
} from "../store/complaintsStore";
import {
  sbGetComplaints,
  sbUpdateComplaint,
  isSupabaseConfigured,
} from "../store/supabaseStore";
import { supabase } from "../lib/supabase";

const ALL_STATUSES: CaseStatus[] = [
  "Pending Review",
  "Under Investigation",
  "Evidence Collection",
  "Recovery In Progress",
  "Resolved",
  "Closed",
];

const statusColors: Record<CaseStatus, string> = {
  "Pending Review":       "bg-amber-100 text-amber-800 border-amber-200",
  "Under Investigation":  "bg-blue-100 text-blue-800 border-blue-200",
  "Evidence Collection":  "bg-purple-100 text-purple-800 border-purple-200",
  "Recovery In Progress": "bg-orange-100 text-orange-800 border-orange-200",
  "Resolved":             "bg-green-100 text-green-800 border-green-200",
  "Closed":               "bg-gray-100 text-gray-600 border-gray-200",
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "All">("All");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<CaseStatus>("Pending Review");
  const [editNotes, setEditNotes] = useState("");
  const [editRecovered, setEditRecovered] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ── Fetch complaints ─────────────────────────────────────────────────────
  const fetchComplaints = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      if (isSupabaseConfigured) {
        const data = await sbGetComplaints();
        setComplaints(data);
      } else {
        setComplaints(getComplaints());
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to load complaints. Falling back to local data.");
      setComplaints(getComplaints());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Auth Guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        // Verify against actual Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin");
          return;
        }
      } else {
        // Fallback: check sessionStorage flag
        const auth = sessionStorage.getItem("igci_admin");
        if (!auth) { navigate("/admin"); return; }
      }
      fetchComplaints();
    };
    checkAuth();
  }, [navigate, fetchComplaints]);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem("igci_admin");
    navigate("/admin");
  };

  const openCase = (c: Complaint) => {
    setSelected(c);
    setEditing(false);
    setEditStatus(c.status);
    setEditNotes(c.adminNotes);
    setEditRecovered(c.recoveredAmount.toString());
  };

  // ── Save case edits ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const updated: Complaint = {
      ...selected,
      status: editStatus,
      adminNotes: editNotes,
      recoveredAmount: parseFloat(editRecovered) || 0,
      lastUpdated: new Date().toISOString(),
    };
    try {
      if (isSupabaseConfigured) {
        await sbUpdateComplaint(updated);
      } else {
        updateComplaint(updated);
      }
      await fetchComplaints(true);
      setSelected(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      // Fallback to localStorage update
      updateComplaint(updated);
      setComplaints(getComplaints());
      setSelected(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  // ── Quick Resolve button ─────────────────────────────────────────────────
  const handleQuickResolve = async (c: Complaint) => {
    if (c.status === "Resolved") return;
    setResolvingId(c.id);
    const updated: Complaint = {
      ...c,
      status: "Resolved",
      lastUpdated: new Date().toISOString(),
    };
    try {
      if (isSupabaseConfigured) {
        await sbUpdateComplaint(updated);
      } else {
        updateComplaint(updated);
      }
      await fetchComplaints(true);
    } catch (err) {
      console.error("Failed to resolve:", err);
      updateComplaint(updated);
      setComplaints(getComplaints());
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = complaints.filter(c => {
    const matchSearch =
      !search ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.scamType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalRecovered = complaints.reduce((a, c) => a + c.recoveredAmount, 0);
  const pending  = complaints.filter(c => c.status === "Pending Review").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Admin Header */}
      <header className="bg-[#0A1628] text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#003087] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm">INTERPOL IGCI — Admin Dashboard</div>
            <div className="text-gray-400 text-xs flex items-center gap-1.5">
              Fraud Recovery Operations Centre
              {isSupabaseConfigured && (
                <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded px-1.5 py-0.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live DB
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            title="Refresh"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText}    label="Total Cases"     value={loading ? "—" : complaints.length.toString()} color="bg-blue-500" />
          <StatCard icon={Clock}       label="Pending Review"  value={loading ? "—" : pending.toString()} color="bg-amber-500" />
          <StatCard icon={CheckCircle} label="Resolved"        value={loading ? "—" : resolved.toString()} color="bg-green-500" />
          <StatCard icon={DollarSign}  label="Total Recovered" value={loading ? "—" : `$${totalRecovered.toLocaleString()}`} color="bg-[#C41230]" />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-[#0A1628] font-bold">
              All Complaints {!loading && `(${filtered.length})`}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                  placeholder="Search cases..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] cursor-pointer"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as CaseStatus | "All")}
                >
                  <option value="All">All Statuses</option>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm">Loading cases{isSupabaseConfigured ? " from database" : ""}…</span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Case #", "Complainant", "Country", "Scam Type", "Amount Lost", "Status", "Filed", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        <div className="flex items-center gap-1">{h} {h !== "Actions" && <ArrowUpDown className="w-3 h-3 opacity-50" />}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">No cases found matching your search.</td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-[#003087] font-semibold whitespace-nowrap">{c.caseNumber}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-[#0A1628]">{c.firstName} {c.lastName}</div>
                          <div className="text-gray-400 text-xs">{c.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.country}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.scamType}</td>
                        <td className="px-4 py-3 font-semibold text-[#C41230] whitespace-nowrap">
                          {c.amountLost.toLocaleString()} {c.currency}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded border text-xs font-semibold whitespace-nowrap ${statusColors[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openCase(c)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#003087] text-white rounded text-xs font-medium hover:bg-[#002070] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            {c.status !== "Resolved" && c.status !== "Closed" && (
                              <button
                                onClick={() => handleQuickResolve(c)}
                                disabled={resolvingId === c.id}
                                title="Mark as Resolved"
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
                              >
                                {resolvingId === c.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <CheckCircle className="w-3.5 h-3.5" />}
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Case Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end">
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#0A1628] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <div className="text-xs text-gray-400">Case File</div>
                <div className="font-bold font-mono tracking-wider">{selected.caseNumber}</div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Current Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-3 py-1.5 rounded-lg border text-sm font-semibold ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 text-[#003087] hover:text-[#C41230] text-sm font-semibold transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {editing ? "Cancel Edit" : "Edit Case"}
                </button>
              </div>

              {/* Victim Info */}
              <Section title="Complainant Details" icon={Users}>
                <InfoRow label="Full Name" value={`${selected.firstName} ${selected.lastName}`} />
                <InfoRow label="Email" value={selected.email} />
                <InfoRow label="Phone" value={selected.phone || "Not provided"} />
                <InfoRow label="Country" value={selected.country} />
              </Section>

              {/* Scam Info */}
              <Section title="Scam Information" icon={AlertCircle}>
                <InfoRow label="Type" value={selected.scamType} />
                <InfoRow label="Date" value={selected.dateOfIncident} />
                <InfoRow label="Scammer Name" value={selected.scammerName || "Unknown"} />
                <InfoRow label="Scammer Email" value={selected.scammerEmail || "—"} />
                <InfoRow label="Scammer Website" value={selected.scammerWebsite || "—"} />
                <InfoRow label="Scammer Phone" value={selected.scammerPhone || "—"} />
              </Section>

              {/* Description */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Incident Description</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">{selected.description}</div>
              </div>

              {/* Financial */}
              <Section title="Financial Details" icon={DollarSign}>
                <InfoRow label="Amount Lost" value={`${selected.amountLost.toLocaleString()} ${selected.currency}`} highlight />
                <InfoRow label="Recovered" value={selected.recoveredAmount > 0 ? `${selected.recoveredAmount.toLocaleString()} ${selected.currency}` : "None yet"} success={selected.recoveredAmount > 0} />
              </Section>

              {/* Payment Details from complainant */}
              {selected.paymentDetails ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Banknote className="w-4 h-4 text-[#003087]" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details Submitted</span>
                    <span className={`ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      selected.paymentDetails.method === "bank"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : selected.paymentDetails.method === "btc"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {selected.paymentDetails.method === "bank" ? "Bank Transfer" : selected.paymentDetails.method === "btc" ? "Bitcoin" : "Ethereum"}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                    <div className="px-4 py-2.5 flex justify-between items-center border-b border-gray-100">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Victim Confirmation</span>
                      {selected.receivedByVictim ? (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          Received
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                    {selected.paymentDetails.method === "bank" ? (
                      <>
                        {selected.paymentDetails.accountHolder && <InfoRow label="Account Holder" value={selected.paymentDetails.accountHolder} />}
                        {selected.paymentDetails.bankName && <InfoRow label="Bank Name" value={selected.paymentDetails.bankName} />}
                        {selected.paymentDetails.accountNumber && <InfoRow label="Account Number" value={selected.paymentDetails.accountNumber} />}
                        {selected.paymentDetails.ibanRouting && <InfoRow label="IBAN / Routing" value={selected.paymentDetails.ibanRouting} />}
                        {selected.paymentDetails.swiftBic && <InfoRow label="SWIFT / BIC" value={selected.paymentDetails.swiftBic} />}
                        {selected.paymentDetails.bankCountry && <InfoRow label="Bank Country" value={selected.paymentDetails.bankCountry} />}
                      </>
                    ) : (
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Bitcoin className={`w-4 h-4 ${selected.paymentDetails.method === "btc" ? "text-orange-500" : "text-indigo-500"}`} />
                          <span className="text-xs text-gray-500">{selected.paymentDetails.method === "btc" ? "BTC" : "ETH"} Wallet Address</span>
                        </div>
                        <p className="font-mono text-xs text-[#0A1628] break-all bg-gray-100 rounded-lg p-2">
                          {selected.paymentDetails.walletAddress}
                        </p>
                      </div>
                    )}
                    {selected.paymentDetails.submittedAt && (
                      <div className="px-4 py-2">
                        <span className="text-[10px] text-gray-400">Submitted: {new Date(selected.paymentDetails.submittedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-50 rounded-xl px-4 py-3">
                  <Banknote className="w-4 h-4" />
                  No payment details submitted yet.
                </div>
              )}

              {/* Edit Panel */}
              {editing && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
                  <h4 className="text-[#003087] font-bold text-sm uppercase tracking-wide">Update Case</h4>
                  <div>
                    <label className="block text-[#0A1628] text-xs font-semibold mb-1.5">Case Status</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as CaseStatus)}
                    >
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#0A1628] text-xs font-semibold mb-1.5">Recovered Amount ({selected.currency})</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
                      value={editRecovered}
                      onChange={e => setEditRecovered(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0A1628] text-xs font-semibold mb-1.5">Investigation Notes (visible to complainant)</label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 h-24 resize-none"
                      placeholder="Add investigation update visible to the complainant..."
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2.5 bg-[#003087] text-white rounded-lg font-semibold text-sm hover:bg-[#002070] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Existing Admin Notes */}
              {selected.adminNotes && !editing && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Investigation Notes</div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900 leading-relaxed">{selected.adminNotes}</div>
                </div>
              )}

              <div className="text-gray-400 text-xs border-t border-gray-100 pt-4">
                Filed: {new Date(selected.createdAt).toLocaleString()} | Last updated: {new Date(selected.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
        <div className="text-[#0A1628] font-bold text-xl">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#003087]" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight, success }: { label: string; value: string; highlight?: boolean; success?: boolean }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5 gap-4">
      <span className="text-gray-500 text-xs shrink-0">{label}</span>
      <span className={`text-xs text-right font-medium ${highlight ? "text-[#C41230] font-bold" : success ? "text-green-600 font-bold" : "text-[#0A1628]"}`}>{value}</span>
    </div>
  );
}

