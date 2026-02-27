import { useState } from "react";
import { useNavigate } from "react-router";
import { FileText, ChevronRight, ChevronLeft, CheckCircle, Shield, AlertCircle, User, DollarSign, Bug, Info } from "lucide-react";
import { generateCaseId, saveCase, type FraudCase } from "../store/cases";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
  "Brazil", "Canada", "Chile", "China", "Colombia", "Denmark", "Egypt", "Ethiopia", "Finland",
  "France", "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kenya", "Mexico", "Morocco", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Romania", "Russia",
  "Saudi Arabia", "Senegal", "Singapore", "South Africa", "South Korea", "Spain", "Sudan",
  "Sweden", "Switzerland", "Tanzania", "Thailand", "Turkey", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Venezuela", "Vietnam", "Zimbabwe",
];

const scamTypes = [
  "Investment / Cryptocurrency Fraud",
  "Romance Scam",
  "Phishing / Bank Fraud",
  "Online Shopping Scam",
  "Tech Support Scam",
  "Business Email Compromise",
  "Lottery / Prize Scam",
  "Advance Fee Fraud (419)",
  "Real Estate Fraud",
  "Employment / Job Scam",
  "Other",
];

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY", "NGN", "GHS", "KES", "ZAR", "INR", "BRL", "MXN", "BTC", "ETH", "USDT"];

type Step = 1 | 2 | 3 | 4;

const initialForm = {
  victimName: "",
  victimEmail: "",
  victimPhone: "",
  victimCountry: "",
  scamType: "",
  amountLost: "",
  currency: "USD",
  dateOfIncident: "",
  description: "",
  scammerName: "",
  scammerEmail: "",
  scammerWebsite: "",
  scammerAccount: "",
  agreeTerms: false,
};

export function ReportCase() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validateStep = (s: Step): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.victimName.trim()) errs.victimName = "Full name is required";
      if (!form.victimEmail.trim() || !/\S+@\S+\.\S+/.test(form.victimEmail)) errs.victimEmail = "Valid email is required";
      if (!form.victimPhone.trim()) errs.victimPhone = "Phone number is required";
      if (!form.victimCountry) errs.victimCountry = "Country is required";
    }
    if (s === 2) {
      if (!form.scamType) errs.scamType = "Please select a fraud type";
      if (!form.amountLost || isNaN(Number(form.amountLost)) || Number(form.amountLost) <= 0) errs.amountLost = "Enter a valid amount";
      if (!form.dateOfIncident) errs.dateOfIncident = "Date of incident is required";
      if (!form.description.trim() || form.description.length < 30) errs.description = "Please provide at least 30 characters describing the fraud";
    }
    if (s === 3) {
      if (!form.scammerName.trim()) errs.scammerName = "Enter the name/alias used by the scammer (write 'Unknown' if unsure)";
    }
    if (s === 4) {
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the declaration";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => (s + 1) as Step);
  };

  const prev = () => setStep(s => (s - 1) as Step);

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    setLoading(true);
    setTimeout(() => {
      const caseId = generateCaseId();
      const now = new Date().toISOString();
      const newCase: FraudCase = {
        id: caseId,
        submittedAt: now,
        status: "pending",
        victimName: form.victimName,
        victimEmail: form.victimEmail,
        victimPhone: form.victimPhone,
        victimCountry: form.victimCountry,
        scamType: form.scamType,
        amountLost: Number(form.amountLost),
        currency: form.currency,
        dateOfIncident: form.dateOfIncident,
        description: form.description,
        scammerName: form.scammerName,
        scammerEmail: form.scammerEmail,
        scammerWebsite: form.scammerWebsite,
        scammerAccount: form.scammerAccount,
        adminNotes: "",
        investigatorAssigned: "",
        recoveryAmount: 0,
        lastUpdated: now,
      };
      saveCase(newCase);
      setSubmittedId(caseId);
      setLoading(false);
    }, 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all focus:ring-2";
  const inputStyle = { borderColor: "#d1d5db", background: "white" };
  const focusColor = "#c9a227";

  const stepTitles = [
    { label: "Your Information", icon: User },
    { label: "Fraud Details", icon: AlertCircle },
    { label: "Scammer Info", icon: Bug },
    { label: "Declaration", icon: Shield },
  ];

  if (submittedId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#f4f6f9" }}>
        <div className="max-w-lg w-full rounded-2xl p-10 border text-center shadow-xl" style={{ background: "white", borderColor: "#e5e7eb" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(34,197,94,0.1)" }}>
            <CheckCircle className="w-10 h-10" style={{ color: "#22c55e" }} />
          </div>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: "1.5rem", fontWeight: 800 }}>Complaint Submitted</h2>
          <p className="text-gray-500 mb-6">Your case has been officially registered with the INTERPOL International Financial Recovery Division.</p>
          <div className="rounded-xl p-4 mb-6 border" style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0369a1" }}>Your Case Reference Number</p>
            <p className="font-mono text-2xl" style={{ color: "#0a1628", fontWeight: 800 }}>{submittedId}</p>
          </div>
          <div className="rounded-xl p-4 mb-6 border text-left" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#d97706" }} />
              <div>
                <p className="text-sm" style={{ color: "#92400e", fontWeight: 600 }}>Important: Save this number</p>
                <p className="text-xs mt-1" style={{ color: "#92400e" }}>Keep this reference number safe. You'll need it to track the status of your case. You will receive an email confirmation within 24 hours.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/track?id=${submittedId}`)}
              className="flex-1 py-3 rounded-lg text-sm transition-all hover:opacity-90"
              style={{ background: "#c9a227", color: "#0a1628", fontWeight: 700 }}
            >
              Track This Case
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-lg text-sm border transition-all hover:bg-gray-50"
              style={{ borderColor: "#d1d5db", color: "#374151", fontWeight: 600 }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#f4f6f9" }}>
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border" style={{ background: "rgba(201,162,39,0.08)", borderColor: "rgba(201,162,39,0.3)" }}>
          <FileText className="w-4 h-4" style={{ color: "#c9a227" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "#c9a227" }}>Secure Official Report Form</span>
        </div>
        <h1 className="text-gray-900 mb-2" style={{ fontSize: "2rem", fontWeight: 800 }}>File a Fraud Complaint</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Complete all sections as accurately as possible. All information is treated with strict confidentiality and used solely for investigative purposes.</p>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 z-0" style={{ background: "#e5e7eb" }} />
          <div className="absolute top-5 left-0 h-0.5 z-0 transition-all duration-500" style={{ background: "#c9a227", width: `${((step - 1) / 3) * 100}%` }} />
          {stepTitles.map((s, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all" style={{
                  background: done ? "#c9a227" : active ? "#0a1628" : "white",
                  borderColor: done || active ? "#c9a227" : "#d1d5db",
                  color: done || active ? (done ? "#0a1628" : "white") : "#9ca3af",
                }}>
                  {done ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className="hidden sm:block text-xs text-center max-w-[80px]" style={{ color: active ? "#0a1628" : "#9ca3af", fontWeight: active ? 700 : 400 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto rounded-2xl shadow-lg border overflow-hidden" style={{ background: "white", borderColor: "#e5e7eb" }}>
        {/* Card header */}
        <div className="px-8 py-5 border-b flex items-center gap-3" style={{ background: "#0a1628", borderColor: "#1e3a5f" }}>
          {(() => { const S = stepTitles[step - 1]; return <S.icon className="w-5 h-5" style={{ color: "#c9a227" }} />; })()}
          <h2 className="text-white" style={{ fontWeight: 700 }}>
            Step {step} of 4 — {stepTitles[step - 1].label}
          </h2>
        </div>

        <div className="p-8">
          {/* Step 1: Victim Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Full Name *</label>
                  <input className={inputClass} style={inputStyle} placeholder="e.g. John Doe" value={form.victimName} onChange={e => set("victimName", e.target.value)} />
                  {errors.victimName && <p className="text-red-500 text-xs mt-1">{errors.victimName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Email Address *</label>
                  <input className={inputClass} style={inputStyle} type="email" placeholder="you@example.com" value={form.victimEmail} onChange={e => set("victimEmail", e.target.value)} />
                  {errors.victimEmail && <p className="text-red-500 text-xs mt-1">{errors.victimEmail}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Phone Number *</label>
                  <input className={inputClass} style={inputStyle} placeholder="+1 555 000 0000" value={form.victimPhone} onChange={e => set("victimPhone", e.target.value)} />
                  {errors.victimPhone && <p className="text-red-500 text-xs mt-1">{errors.victimPhone}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Country of Residence *</label>
                  <select className={inputClass} style={inputStyle} value={form.victimCountry} onChange={e => set("victimCountry", e.target.value)}>
                    <option value="">-- Select Country --</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.victimCountry && <p className="text-red-500 text-xs mt-1">{errors.victimCountry}</p>}
                </div>
              </div>
              <div className="rounded-lg p-4 border flex items-start gap-3" style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}>
                <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#0369a1" }} />
                <p className="text-sm" style={{ color: "#0369a1" }}>
                  Your personal information is encrypted and protected. It will only be accessed by assigned investigators and is never shared with third parties.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Fraud Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Type of Fraud *</label>
                  <select className={inputClass} style={inputStyle} value={form.scamType} onChange={e => set("scamType", e.target.value)}>
                    <option value="">-- Select Type --</option>
                    {scamTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.scamType && <p className="text-red-500 text-xs mt-1">{errors.scamType}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Date of Incident *</label>
                  <input className={inputClass} style={inputStyle} type="date" value={form.dateOfIncident} onChange={e => set("dateOfIncident", e.target.value)} max={new Date().toISOString().split("T")[0]} />
                  {errors.dateOfIncident && <p className="text-red-500 text-xs mt-1">{errors.dateOfIncident}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Amount Lost *</label>
                  <input className={inputClass} style={inputStyle} type="number" min="1" placeholder="e.g. 5000" value={form.amountLost} onChange={e => set("amountLost", e.target.value)} />
                  {errors.amountLost && <p className="text-red-500 text-xs mt-1">{errors.amountLost}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Currency *</label>
                  <select className={inputClass} style={inputStyle} value={form.currency} onChange={e => set("currency", e.target.value)}>
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Description of Fraud *</label>
                <textarea
                  rows={5}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Describe in detail how the fraud occurred. Include how you were contacted, what you were promised, how payments were made, and any other relevant information..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
                  <p className="text-xs text-gray-400">{form.description.length} chars</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scammer Info */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-lg p-4 border flex items-start gap-3 mb-2" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#d97706" }} />
                <p className="text-sm" style={{ color: "#92400e" }}>
                  Provide as much detail about the scammer as possible. Even partial information can be critical for tracing. Write "Unknown" if you don't know.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Scammer Name / Alias *</label>
                  <input className={inputClass} style={inputStyle} placeholder="Name, alias, or company name used" value={form.scammerName} onChange={e => set("scammerName", e.target.value)} />
                  {errors.scammerName && <p className="text-red-500 text-xs mt-1">{errors.scammerName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Scammer Email</label>
                  <input className={inputClass} style={inputStyle} type="email" placeholder="Email used to contact you" value={form.scammerEmail} onChange={e => set("scammerEmail", e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Website / Platform Used</label>
                  <input className={inputClass} style={inputStyle} placeholder="e.g. fakeinvestment.com" value={form.scammerWebsite} onChange={e => set("scammerWebsite", e.target.value)} />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Bank / Wallet Account Details</label>
                  <input className={inputClass} style={inputStyle} placeholder="Account number, IBAN, crypto wallet address..." value={form.scammerAccount} onChange={e => set("scammerAccount", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Declaration */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-xl p-6 border" style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <FileText className="w-5 h-5" style={{ color: "#c9a227" }} />
                  Summary of Your Complaint
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Name", value: form.victimName },
                    { label: "Country", value: form.victimCountry },
                    { label: "Fraud Type", value: form.scamType },
                    { label: "Amount", value: `${form.currency} ${Number(form.amountLost).toLocaleString()}` },
                    { label: "Date of Incident", value: form.dateOfIncident },
                    { label: "Scammer", value: form.scammerName },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between gap-2 border-b pb-2" style={{ borderColor: "#e5e7eb" }}>
                      <span className="text-gray-500">{item.label}:</span>
                      <span className="text-gray-900 text-right" style={{ fontWeight: 600 }}>{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-5 border" style={{ background: "white", borderColor: "#e5e7eb" }}>
                <h3 className="text-gray-900 mb-3" style={{ fontWeight: 700 }}>Statutory Declaration</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  I hereby declare that the information provided in this complaint is true, accurate and complete to the best of my knowledge. I understand that providing false information in an official complaint is a criminal offence and may result in legal action. I consent to the use of this information for investigative purposes by INTERPOL's International Financial Recovery Division and its partner agencies.
                </p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: "#c9a227" }}
                    checked={form.agreeTerms}
                    onChange={e => set("agreeTerms", e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that all information above is truthful and accurate. I agree to the INTERPOL IFR terms of service and understand the above declaration. *
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-xs mt-2">{errors.agreeTerms}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: "#e5e7eb" }}>
            {step > 1 ? (
              <button
                onClick={prev}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border text-sm transition-all hover:bg-gray-50"
                style={{ borderColor: "#d1d5db", color: "#374151", fontWeight: 600 }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm transition-all hover:opacity-90"
                style={{ background: "#c9a227", color: "#0a1628", fontWeight: 700 }}
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: "#0a1628", color: "white", fontWeight: 700 }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Submit Official Complaint
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
