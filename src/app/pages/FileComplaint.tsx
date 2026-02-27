import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  User,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Lock,
  Copy,
  Search,
  Info,
} from "lucide-react";
import { saveComplaint, generateCaseNumber, type ScamType } from "../store/complaintsStore";

const SCAM_TYPES: ScamType[] = [
  "Online Shopping",
  "Investment Fraud",
  "Romance Scam",
  "Phishing",
  "Cryptocurrency Fraud",
  "Business Email Compromise",
  "Lottery/Prize Scam",
  "Tech Support Scam",
  "Bank Fraud",
  "Other",
];

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD", "JPY", "CHF", "CNY", "INR", "BTC", "ETH", "Other"];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
  "Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Ethiopia","Finland","France",
  "Germany","Ghana","Greece","Hong Kong","Hungary","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Japan","Jordan","Kenya","South Korea","Malaysia","Mexico","Morocco","Netherlands",
  "New Zealand","Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia",
  "Singapore","South Africa","Spain","Sweden","Switzerland","Taiwan","Thailand","Turkey","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Venezuela","Vietnam","Zimbabwe","Other",
];

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Scam Details", icon: AlertTriangle },
  { id: 3, label: "Financial Info", icon: DollarSign },
  { id: 4, label: "Review", icon: FileText },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  scamType: ScamType | "";
  dateOfIncident: string;
  scammerName: string;
  scammerEmail: string;
  scammerWebsite: string;
  scammerPhone: string;
  description: string;
  amountLost: string;
  currency: string;
  agree: boolean;
}

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  scamType: "",
  dateOfIncident: "",
  scammerName: "",
  scammerEmail: "",
  scammerWebsite: "",
  scammerPhone: "",
  description: "",
  amountLost: "",
  currency: "USD",
  agree: false,
};

function InputField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[#0A1628] mb-1.5 text-sm font-semibold">
        {label} {required && <span className="text-[#C41230]">*</span>}
      </label>
      {children}
      {hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] transition-all bg-white placeholder-gray-400";
const selectClass = `${inputClass} appearance-none cursor-pointer`;

export function FileComplaint() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "First name is required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
      if (!form.country) newErrors.country = "Country is required";
    }
    if (s === 2) {
      if (!form.scamType) newErrors.scamType = "Scam type is required";
      if (!form.dateOfIncident) newErrors.dateOfIncident = "Date is required";
      if (!form.description.trim() || form.description.length < 50) newErrors.description = "Please provide at least 50 characters describing the incident";
    }
    if (s === 3) {
      if (!form.amountLost || isNaN(Number(form.amountLost)) || Number(form.amountLost) <= 0) newErrors.amountLost = "Please enter a valid amount";
    }
    if (s === 4) {
      if (!form.agree) newErrors.agree = "You must confirm the information is accurate";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setTimeout(() => {
      const cn = generateCaseNumber();
      setCaseNumber(cn);
      saveComplaint({
        id: Date.now().toString(),
        caseNumber: cn,
        createdAt: new Date().toISOString(),
        status: "Pending Review",
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        scamType: form.scamType as ScamType,
        amountLost: parseFloat(form.amountLost),
        currency: form.currency,
        dateOfIncident: form.dateOfIncident,
        scammerName: form.scammerName,
        scammerEmail: form.scammerEmail,
        scammerWebsite: form.scammerWebsite,
        scammerPhone: form.scammerPhone,
        description: form.description,
        adminNotes: "",
        recoveredAmount: 0,
        lastUpdated: new Date().toISOString(),
      });
      setSubmitting(false);
      setStep(5);
    }, 2000);
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(caseNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Fallback for restricted clipboard environments
      const el = document.createElement("textarea");
      el.value = caseNumber;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // silently fail
      }
      document.body.removeChild(el);
    }
  };

  return (
    <div className="bg-[#F5F6FA] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[#0A1628] mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
            File a Fraud Complaint
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Provide as much detail as possible. Accurate information significantly increases the chances of fund recovery.
          </p>
        </div>

        {/* Security notice */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
          <Lock className="w-4 h-4 shrink-0" />
          <span>This form is encrypted. Your personal data is protected under international law and INTERPOL's privacy policy.</span>
        </div>

        {/* Step Indicator */}
        {step < 5 && (
          <div className="flex items-center justify-center mb-8">
            {steps.map(({ id, label, icon: Icon }, idx) => (
              <div key={id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step > id ? "bg-green-500 border-green-500" :
                    step === id ? "bg-[#003087] border-[#003087]" :
                    "bg-white border-gray-200"
                  }`}>
                    {step > id ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${step === id ? "text-white" : "text-gray-400"}`} />
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden sm:block ${step === id ? "text-[#003087]" : step > id ? "text-green-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-1 mb-5 transition-colors duration-300 ${step > id ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="text-[#0A1628] mb-1" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Personal Information</h2>
              <p className="text-gray-500 text-sm mb-6">Your identity will remain confidential throughout the investigation.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="First Name" required>
                  <input className={inputClass} placeholder="John" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                  {errors.firstName && <p className="text-[#C41230] text-xs mt-1">{errors.firstName}</p>}
                </InputField>
                <InputField label="Last Name" required>
                  <input className={inputClass} placeholder="Doe" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                  {errors.lastName && <p className="text-[#C41230] text-xs mt-1">{errors.lastName}</p>}
                </InputField>
                <InputField label="Email Address" required>
                  <input className={inputClass} type="email" placeholder="john.doe@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                  {errors.email && <p className="text-[#C41230] text-xs mt-1">{errors.email}</p>}
                </InputField>
                <InputField label="Phone Number" hint="Include country code">
                  <input className={inputClass} placeholder="+1 555 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
                </InputField>
                <div className="sm:col-span-2">
                  <InputField label="Country of Residence" required>
                    <select className={selectClass} value={form.country} onChange={e => set("country", e.target.value)}>
                      <option value="">Select your country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p className="text-[#C41230] text-xs mt-1">{errors.country}</p>}
                  </InputField>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Scam Details */}
          {step === 2 && (
            <div>
              <h2 className="text-[#0A1628] mb-1" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Scam Details</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us about the scam. Include everything you know about the fraudster.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Type of Scam" required>
                  <select className={selectClass} value={form.scamType} onChange={e => set("scamType", e.target.value)}>
                    <option value="">Select scam type</option>
                    {SCAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.scamType && <p className="text-[#C41230] text-xs mt-1">{errors.scamType}</p>}
                </InputField>
                <InputField label="Date of Incident" required>
                  <input className={inputClass} type="date" value={form.dateOfIncident} max={new Date().toISOString().split("T")[0]} onChange={e => set("dateOfIncident", e.target.value)} />
                  {errors.dateOfIncident && <p className="text-[#C41230] text-xs mt-1">{errors.dateOfIncident}</p>}
                </InputField>
                <InputField label="Scammer's Name / Alias">
                  <input className={inputClass} placeholder="As given to you" value={form.scammerName} onChange={e => set("scammerName", e.target.value)} />
                </InputField>
                <InputField label="Scammer's Email">
                  <input className={inputClass} type="email" placeholder="scammer@email.com" value={form.scammerEmail} onChange={e => set("scammerEmail", e.target.value)} />
                </InputField>
                <InputField label="Scammer's Website">
                  <input className={inputClass} placeholder="www.scamsite.com" value={form.scammerWebsite} onChange={e => set("scammerWebsite", e.target.value)} />
                </InputField>
                <InputField label="Scammer's Phone">
                  <input className={inputClass} placeholder="+1 555 000 0000" value={form.scammerPhone} onChange={e => set("scammerPhone", e.target.value)} />
                </InputField>
                <div className="sm:col-span-2">
                  <InputField label="Detailed Description of the Scam" required hint="Minimum 50 characters. Include how you were contacted, what happened, and the timeline of events.">
                    <textarea
                      className={`${inputClass} resize-none h-32`}
                      placeholder="Describe in detail how you were scammed..."
                      value={form.description}
                      onChange={e => set("description", e.target.value)}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.description ? <p className="text-[#C41230] text-xs">{errors.description}</p> : <span />}
                      <span className={`text-xs ${form.description.length < 50 ? "text-gray-400" : "text-green-600"}`}>{form.description.length} / 50+ chars</span>
                    </div>
                  </InputField>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Info */}
          {step === 3 && (
            <div>
              <h2 className="text-[#0A1628] mb-1" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Financial Information</h2>
              <p className="text-gray-500 text-sm mb-6">Provide accurate financial details to help our forensic team trace the funds.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Amount Lost" required>
                  <input className={inputClass} type="number" min="1" placeholder="0.00" value={form.amountLost} onChange={e => set("amountLost", e.target.value)} />
                  {errors.amountLost && <p className="text-[#C41230] text-xs mt-1">{errors.amountLost}</p>}
                </InputField>
                <InputField label="Currency">
                  <select className={selectClass} value={form.currency} onChange={e => set("currency", e.target.value)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </InputField>
              </div>
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> Our forensic finance team will contact you to collect transaction IDs, bank statements, and wallet addresses as evidence. Do not send funds to anyone claiming to be an INTERPOL officer requesting a "recovery fee."
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-[#0A1628] mb-1" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Review Your Complaint</h2>
              <p className="text-gray-500 text-sm mb-6">Please review all information before submitting.</p>
              <div className="space-y-4">
                <ReviewSection title="Personal Information">
                  <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <ReviewRow label="Email" value={form.email} />
                  <ReviewRow label="Phone" value={form.phone || "Not provided"} />
                  <ReviewRow label="Country" value={form.country} />
                </ReviewSection>
                <ReviewSection title="Scam Details">
                  <ReviewRow label="Type" value={form.scamType} />
                  <ReviewRow label="Date" value={form.dateOfIncident} />
                  <ReviewRow label="Scammer" value={form.scammerName || "Unknown"} />
                  <ReviewRow label="Description" value={form.description} />
                </ReviewSection>
                <ReviewSection title="Financial Details">
                  <ReviewRow label="Amount Lost" value={`${form.amountLost} ${form.currency}`} highlight />
                </ReviewSection>
              </div>
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={e => set("agree", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#003087]"
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that all information provided is accurate and truthful to the best of my knowledge. I understand that filing a false report is a criminal offense.
                  </span>
                </label>
                {errors.agree && <p className="text-[#C41230] text-xs mt-1">{errors.agree}</p>}
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-[#0A1628] mb-2" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Complaint Successfully Filed</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                Your case has been registered and assigned to our cybercrime investigation unit. You will receive an email confirmation shortly.
              </p>
              <div className="bg-[#003087]/5 border border-[#003087]/20 rounded-xl p-5 mb-6 inline-block mx-auto">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Case Reference Number</div>
                <div className="text-[#003087] font-bold text-2xl tracking-widest mb-3">{caseNumber}</div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 mx-auto text-sm text-[#003087] hover:text-[#C41230] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Case Number"}
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-6 text-sm text-amber-800">
                <strong>Next Steps:</strong> Our team will review your complaint within 24-48 hours. You may be contacted for additional information. Keep your case number safe to track progress.
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/track")}
                  className="flex items-center justify-center gap-2 bg-[#003087] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002070] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Track This Case
                </button>
                <button
                  onClick={() => { setForm(emptyForm); setStep(1); }}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  File Another Complaint
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#003087] text-white rounded-lg font-medium text-sm hover:bg-[#002070] transition-colors"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#C41230] text-white rounded-lg font-semibold text-sm hover:bg-[#a30e28] transition-colors disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Submit Complaint
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <div className="bg-[#003087]/10 px-4 py-2 text-xs font-semibold text-[#003087] uppercase tracking-wider">{title}</div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="px-4 py-3 flex justify-between gap-4">
      <span className="text-gray-500 text-sm shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "text-[#C41230] font-bold" : "text-[#0A1628] font-medium"}`}>{value || "—"}</span>
    </div>
  );
}