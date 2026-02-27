import { useState } from "react";
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader, DollarSign, Calendar, MapPin, User } from "lucide-react";
import { getComplaintByCaseNumber, type Complaint, type CaseStatus } from "../store/complaintsStore";

const statusConfig: Record<CaseStatus, { color: string; bg: string; icon: React.ElementType }> = {
  "Pending Review":       { color: "text-amber-700",  bg: "bg-amber-100 border-amber-200",   icon: Clock },
  "Under Investigation":  { color: "text-blue-700",   bg: "bg-blue-100 border-blue-200",     icon: Search },
  "Evidence Collection":  { color: "text-purple-700", bg: "bg-purple-100 border-purple-200", icon: FileText },
  "Recovery In Progress": { color: "text-orange-700", bg: "bg-orange-100 border-orange-200", icon: Loader },
  "Resolved":             { color: "text-green-700",  bg: "bg-green-100 border-green-200",   icon: CheckCircle },
  "Closed":               { color: "text-gray-600",   bg: "bg-gray-100 border-gray-200",     icon: AlertCircle },
};

const statusOrder: CaseStatus[] = [
  "Pending Review",
  "Under Investigation",
  "Evidence Collection",
  "Recovery In Progress",
  "Resolved",
];

export function TrackCase() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = getComplaintByCaseNumber(query.trim());
    setComplaint(found || null);
    setSearched(true);
  };

  const currentStatusIdx = complaint ? statusOrder.indexOf(complaint.status as CaseStatus) : -1;

  return (
    <div className="bg-[#F5F6FA] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#003087] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#0A1628] mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
            Track Your Case
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your case reference number to view the current status and updates on your complaint.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-[#0A1628] text-sm font-semibold mb-2">
            Case Reference Number <span className="text-[#C41230]">*</span>
          </label>
          <div className="flex gap-3">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] font-mono tracking-wider placeholder-gray-400"
              placeholder="e.g. IGCI-2024-847392"
              value={query}
              onChange={e => setQuery(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#003087] text-white rounded-lg font-semibold text-sm hover:bg-[#002070] transition-colors flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Your case number was provided when you filed your complaint (format: IGCI-YYYY-XXXXXX)
          </p>
        </div>

        {/* Demo hint */}
        {!searched && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <strong>Demo:</strong> Try searching for <code className="bg-blue-100 px-1 rounded font-mono text-xs">IGCI-2024-847392</code> or <code className="bg-blue-100 px-1 rounded font-mono text-xs">IGCI-2025-112847</code>
          </div>
        )}

        {/* Not found */}
        {searched && !complaint && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#C41230]" />
            </div>
            <h3 className="text-[#0A1628] mb-2" style={{ fontWeight: 700 }}>Case Not Found</h3>
            <p className="text-gray-500 text-sm">
              No case found with reference number <strong>{query}</strong>. Please double-check your case number or contact us at <span className="text-[#003087]">complaints@igci-interpol.int</span>
            </p>
          </div>
        )}

        {/* Result */}
        {complaint && (
          <div className="space-y-5">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Case Reference</div>
                  <div className="text-[#003087] font-bold text-xl tracking-wider font-mono">{complaint.caseNumber}</div>
                </div>
                <StatusBadge status={complaint.status} />
              </div>

              {/* Progress Timeline */}
              {complaint.status !== "Closed" && (
                <div className="mt-2">
                  <div className="flex items-center gap-0 overflow-x-auto pb-2">
                    {statusOrder.map((s, idx) => {
                      const passed = idx <= currentStatusIdx;
                      const current = idx === currentStatusIdx;
                      const Icon = statusConfig[s].icon;
                      return (
                        <div key={s} className="flex items-center">
                          <div className="flex flex-col items-center min-w-[60px]">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              passed ? "bg-[#003087] border-[#003087]" : "bg-white border-gray-200"
                            } ${current ? "ring-4 ring-[#003087]/20" : ""}`}>
                              <Icon className={`w-4 h-4 ${passed ? "text-white" : "text-gray-400"}`} />
                            </div>
                            <span className={`text-[10px] mt-1 text-center leading-tight max-w-[56px] ${passed ? "text-[#003087] font-medium" : "text-gray-400"}`}>
                              {s}
                            </span>
                          </div>
                          {idx < statusOrder.length - 1 && (
                            <div className={`w-8 h-0.5 mb-5 shrink-0 ${idx < currentStatusIdx ? "bg-[#003087]" : "bg-gray-200"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Case Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[#0A1628] mb-4" style={{ fontWeight: 700 }}>Case Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DetailItem icon={User} label="Complainant" value={`${complaint.firstName} ${complaint.lastName}`} />
                <DetailItem icon={MapPin} label="Country" value={complaint.country} />
                <DetailItem icon={AlertCircle} label="Scam Type" value={complaint.scamType} />
                <DetailItem icon={Calendar} label="Date of Incident" value={complaint.dateOfIncident} />
                <DetailItem icon={DollarSign} label="Amount Reported" value={`${complaint.amountLost.toLocaleString()} ${complaint.currency}`} />
                <DetailItem
                  icon={DollarSign}
                  label="Amount Recovered"
                  value={complaint.recoveredAmount > 0 ? `${complaint.recoveredAmount.toLocaleString()} ${complaint.currency}` : "Pending"}
                  highlight={complaint.recoveredAmount > 0}
                />
              </div>
            </div>

            {/* Admin Notes */}
            {complaint.adminNotes && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-[#0A1628] mb-3" style={{ fontWeight: 700 }}>Investigation Update</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900 leading-relaxed">
                  {complaint.adminNotes}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Last updated: {new Date(complaint.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}

            {/* Recovery Banner */}
            {complaint.status === "Resolved" && complaint.recoveredAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-green-800 font-bold text-lg">Funds Successfully Recovered</div>
                  <div className="text-green-700 text-sm">
                    {complaint.recoveredAmount.toLocaleString()} {complaint.currency} has been recovered and will be reimbursed to your registered account within 5-10 business days.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-4 h-4" />
      {status}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#003087]" />
      </div>
      <div>
        <div className="text-gray-400 text-xs">{label}</div>
        <div className={`text-sm font-semibold ${highlight ? "text-green-600" : "text-[#0A1628]"}`}>{value}</div>
      </div>
    </div>
  );
}
