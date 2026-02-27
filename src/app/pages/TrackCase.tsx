import { useState } from "react";
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader, Loader2, DollarSign, Calendar, MapPin, User, Banknote, X, ShieldCheck, ChevronsRight, Bitcoin } from "lucide-react";
import { getComplaintByCaseNumber, updateComplaint, type Complaint, type CaseStatus, type PaymentDetails } from "../store/complaintsStore";
import { sbGetComplaintByCaseNumber, sbUpdateComplaint, isSupabaseConfigured } from "../store/supabaseStore";

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

type PayMethod = "bank" | "btc" | "eth";

interface BankForm {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ibanRouting: string;
  swiftBic: string;
  bankCountry: string;
}

const emptyBank: BankForm = {
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ibanRouting: "",
  swiftBic: "",
  bankCountry: "",
};

export function TrackCase() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);

  // Payment details state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>("bank");
  const [bank, setBank] = useState<BankForm>(emptyBank);
  const [walletAddress, setWalletAddress] = useState("");
  const [bankErrors, setBankErrors] = useState<Partial<BankForm>>({});
  const [walletError, setWalletError] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const setB = (field: keyof BankForm, value: string) => {
    setBank(prev => ({ ...prev, [field]: value }));
    if (bankErrors[field]) setBankErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validatePayment = (): boolean => {
    if (payMethod === "bank") {
      const errs: Partial<BankForm> = {};
      if (!bank.accountHolder.trim()) errs.accountHolder = "Required";
      if (!bank.bankName.trim()) errs.bankName = "Required";
      if (!bank.accountNumber.trim()) errs.accountNumber = "Required";
      if (!bank.bankCountry.trim()) errs.bankCountry = "Required";
      setBankErrors(errs);
      return Object.keys(errs).length === 0;
    } else {
      if (!walletAddress.trim()) { setWalletError("Wallet address is required"); return false; }
      setWalletError("");
      return true;
    }
  };

  const handleMarkReceived = async () => {
    if (!complaint) return;
    setPaymentSubmitting(true);
    const updated: Complaint = { ...complaint, receivedByVictim: true, lastUpdated: new Date().toISOString() };
    try {
      if (isSupabaseConfigured) {
        await sbUpdateComplaint(updated);
      } else {
        updateComplaint(updated);
      }
      setComplaint(updated);
    } catch (err) {
      console.error("Failed to mark received status:", err);
      updateComplaint(updated);
      setComplaint(updated);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {

    if (!validatePayment() || !complaint) return;
    setPaymentSubmitting(true);
    const details: PaymentDetails = payMethod === "bank"
      ? { method: "bank", ...bank, submittedAt: new Date().toISOString() }
      : { method: payMethod, walletAddress: walletAddress.trim(), submittedAt: new Date().toISOString() };

    const updated: Complaint = { ...complaint, paymentDetails: details, lastUpdated: new Date().toISOString() };
    try {
      if (isSupabaseConfigured) {
        await sbUpdateComplaint(updated);
      } else {
        updateComplaint(updated);
      }
      setComplaint(updated);
    } catch (err) {
      console.error("Failed to save payment details to Supabase, falling back:", err);
      updateComplaint(updated);
      setComplaint(updated);
    } finally {
      setPaymentSubmitting(false);
      setPaymentSubmitted(true);
      setShowPaymentForm(false);
    }
  };


  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      let found: Complaint | null | undefined = null;
      if (isSupabaseConfigured) {
        found = await sbGetComplaintByCaseNumber(query.trim());
        // Fallback to local storage if not found in Supabase (in case of failed sync)
        if (!found) {
          found = getComplaintByCaseNumber(query.trim());
        }
      } else {
        found = getComplaintByCaseNumber(query.trim());
      }
      setComplaint(found || null);
    } catch (err) {
      console.error("Supabase lookup failed, falling back:", err);
      setComplaint(getComplaintByCaseNumber(query.trim()) || null);
    } finally {
      setSearched(true);
      setLoading(false);
    }
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
              onKeyDown={e => e.key === "Enter" && !loading && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-[#003087] text-white rounded-lg font-semibold text-sm hover:bg-[#002070] transition-colors flex items-center gap-2 shrink-0 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Your case number was provided when you filed your complaint (format: IGCI-YYYY-XXXXXX)
          </p>
        </div>



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

            {/* Recovery Banner + Payment Details */}
            {complaint.status === "Resolved" && (
              <div className="space-y-4">
                {/* Banner */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-green-800 font-bold text-lg">Funds Successfully Recovered</div>
                    <div className="text-green-700 text-sm mt-0.5">
                      <span className="font-semibold">{complaint.recoveredAmount.toLocaleString()} {complaint.currency}</span> has been recovered and is ready for disbursement.
                      {(paymentSubmitted || complaint.paymentDetails)
                        ? " Your payment details have been received."
                        : " Please provide your payment details below to receive your funds."}
                    </div>
                  </div>
                  {!(paymentSubmitted || complaint.paymentDetails) && (
                    <button
                      onClick={() => setShowPaymentForm(v => !v)}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      <Banknote className="w-4 h-4" />
                      {showPaymentForm ? "Hide Form" : "Submit Payment Details"}
                    </button>
                  )}
                </div>

                {/* Payment Form */}
                {!(paymentSubmitted || complaint.paymentDetails) && showPaymentForm && (
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-[#0A1628] font-bold text-base flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-[#003087]" />
                          Payment Details
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">Choose how you would like to receive your funds.</p>
                      </div>
                      <button onClick={() => setShowPaymentForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Method Tabs */}
                    <div className="flex gap-2 mb-5">
                      {(["bank", "btc", "eth"] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => { setPayMethod(m); setBankErrors({}); setWalletError(""); }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            payMethod === m
                              ? "bg-[#003087] text-white border-[#003087]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#003087] hover:text-[#003087]"
                          }`}
                        >
                          {m === "bank" && <Banknote className="w-4 h-4" />}
                          {m === "btc" && <Bitcoin className="w-4 h-4" />}
                          {m === "eth" && <span className="font-bold text-xs">Ξ</span>}
                          {m === "bank" ? "Bank Transfer" : m === "btc" ? "Bitcoin (BTC)" : "Ethereum (ETH)"}
                        </button>
                      ))}
                    </div>

                    {/* Bank Fields */}
                    {payMethod === "bank" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PayField label="Account Holder Name" required error={bankErrors.accountHolder}>
                          <input className={fldClass} placeholder="Full legal name" value={bank.accountHolder} onChange={e => setB("accountHolder", e.target.value)} />
                        </PayField>
                        <PayField label="Bank Name" required error={bankErrors.bankName}>
                          <input className={fldClass} placeholder="e.g. Chase, Barclays" value={bank.bankName} onChange={e => setB("bankName", e.target.value)} />
                        </PayField>
                        <PayField label="Account Number" required error={bankErrors.accountNumber}>
                          <input className={fldClass} placeholder="Your account number" value={bank.accountNumber} onChange={e => setB("accountNumber", e.target.value)} />
                        </PayField>
                        <PayField label="IBAN / Routing Number" error={bankErrors.ibanRouting}>
                          <input className={fldClass} placeholder="IBAN or ABA routing number" value={bank.ibanRouting} onChange={e => setB("ibanRouting", e.target.value)} />
                        </PayField>
                        <PayField label="SWIFT / BIC Code" error={bankErrors.swiftBic}>
                          <input className={fldClass} placeholder="e.g. BARCGB22" value={bank.swiftBic} onChange={e => setB("swiftBic", e.target.value)} />
                        </PayField>
                        <PayField label="Bank Country" required error={bankErrors.bankCountry}>
                          <input className={fldClass} placeholder="Country where bank is located" value={bank.bankCountry} onChange={e => setB("bankCountry", e.target.value)} />
                        </PayField>
                      </div>
                    )}

                    {/* Crypto Fields */}
                    {(payMethod === "btc" || payMethod === "eth") && (
                      <div className="space-y-4">
                        <div className={`flex items-center gap-3 rounded-xl p-4 ${payMethod === "btc" ? "bg-orange-50 border border-orange-200" : "bg-indigo-50 border border-indigo-200"}`}>
                          <Bitcoin className={`w-8 h-8 shrink-0 ${payMethod === "btc" ? "text-orange-500" : "text-indigo-500"}`} />
                          <div>
                            <div className={`font-bold text-sm ${payMethod === "btc" ? "text-orange-800" : "text-indigo-800"}`}>{payMethod === "btc" ? "Bitcoin (BTC)" : "Ethereum (ETH)"} Wallet</div>
                            <div className={`text-xs ${payMethod === "btc" ? "text-orange-700" : "text-indigo-700"}`}>
                              Enter your {payMethod === "btc" ? "BTC" : "ETH"} wallet address. Funds will be sent directly to this address.
                            </div>
                          </div>
                        </div>
                        <PayField label={`${payMethod === "btc" ? "Bitcoin (BTC)" : "Ethereum (ETH)"} Wallet Address`} required error={walletError}>
                          <input
                            className={`${fldClass} font-mono text-xs tracking-wide`}
                            placeholder={payMethod === "btc" ? "bc1q... or 1... or 3..." : "0x..."}
                            value={walletAddress}
                            onChange={e => { setWalletAddress(e.target.value); if (walletError) setWalletError(""); }}
                          />
                        </PayField>
                      </div>
                    )}

                    <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
                      <strong>Security Notice:</strong> INTERPOL will never ask for fees to release recovered funds. Crypto transfers are irreversible — double-check your address.
                    </div>
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={paymentSubmitting}
                        className="flex items-center gap-2 px-7 py-3 bg-[#003087] hover:bg-[#002070] text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
                      >
                        {paymentSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>) : (<><ChevronsRight className="w-4 h-4" /> Submit Details</>)}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submission Success & Mark as Received */}
                {(paymentSubmitted || complaint.paymentDetails) && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-[#003087] font-bold text-base">Payment Details Received</div>
                        <div className="text-blue-800 text-sm mt-1">
                          Your details have been securely submitted. The recovered funds of{" "}
                          <span className="font-semibold">{complaint.recoveredAmount.toLocaleString()} {complaint.currency}</span>{" "}
                          will be disbursed within <strong>5–10 business days</strong>. You will receive an email confirmation.
                        </div>
                        {complaint.paymentDetails && (
                          <div className="mt-3 text-xs text-gray-500 font-mono">
                            Method: <span className="font-semibold text-[#003087] uppercase">{complaint.paymentDetails.method}</span>
                            {complaint.paymentDetails.method !== "bank" && complaint.paymentDetails.walletAddress && (
                              <> · Wallet: <span className="break-all">{complaint.paymentDetails.walletAddress}</span></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {!complaint.receivedByVictim ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                            <Banknote className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-amber-900 font-bold text-sm">Have you received your funds?</div>
                            <div className="text-amber-800 text-xs">Once the transfer is visible in your account, please confirm it below.</div>
                          </div>
                        </div>
                        <button
                          onClick={handleMarkReceived}
                          disabled={paymentSubmitting}
                          className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          {paymentSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Confirm Receipt
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-100 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-green-900 font-bold text-sm">Transfer Confirmed</div>
                          <div className="text-green-800 text-xs text-balance">The victim has confirmed receipt of <strong>{complaint.recoveredAmount.toLocaleString()} {complaint.currency}</strong>. This case is now fully settled.</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

const fldClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] transition-all bg-white placeholder-gray-400";

function PayField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[#0A1628] mb-1.5 text-sm font-semibold">
        {label} {required && <span className="text-[#C41230]">*</span>}
      </label>
      {children}
      {error && <p className="text-[#C41230] text-xs mt-1">{error}</p>}
    </div>
  );
}
