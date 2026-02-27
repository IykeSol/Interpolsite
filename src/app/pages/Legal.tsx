import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Shield, Lock, Gavel, Scale, FileText, ChevronRight } from "lucide-react";

type LegalTab = "privacy" | "terms" | "legal";

export function Legal() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<LegalTab>("privacy");

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "privacy" || hash === "terms" || hash === "legal") {
      setActiveTab(hash as LegalTab);
    }
  }, [location]);

  const tabs: { id: LegalTab; label: string; icon: any }[] = [
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "terms",   label: "Terms of Use",   icon: Gavel },
    { id: "legal",   label: "Legal Notice",   icon: Scale },
  ];

  return (
    <div className="bg-[#F5F6FA] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#003087] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#0A1628] mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800 }}>
            Legal Framework
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Review the official governing policies, data protection protocols, and legal notices of the INTERPOL | IGCI.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                activeTab === tab.id
                  ? "bg-[#003087] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {activeTab === "privacy" && <PrivacyTab />}
            {activeTab === "terms" && <TermsTab />}
            {activeTab === "legal" && <NoticeTab />}
          </div>

          {/* Footer Disclaimer */}
          <div className="bg-gray-50 border-t border-gray-100 px-8 py-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003087]/10 rounded-full flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#003087]" />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Official Notice:</strong> These documents are subject to periodic review under international law and the INTERPOL General Assembly resolutions. Last Updated: February 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold text-[#0A1628] mb-6 flex items-center gap-2">
        <Lock className="text-[#003087]" /> Global Privacy Policy
      </h2>
      <div className="space-y-6 text-[#4B5563] leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">1. Data Protection Commitment</h3>
          <p>
            The INTERPOL Global Complex for Innovation (IGCI) is committed to protecting the privacy and security of individual personal data. Our operations are governed by the INTERPOL Rules on the Processing of Data (RPD).
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">2. Information We Collect</h3>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Identity Data:</strong> Full name, contact information, and government identification during complaint filing.</li>
            <li><strong>Case Specifics:</strong> Financial loss details, transaction IDs, and descriptions of fraudulent activity.</li>
            <li><strong>Technical Metadata:</strong> IP addresses and browser logs used solely for security and fraud prevention.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">3. How We Use Data</h3>
          <p>
            Personal information collected through this portal is used exclusively for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>International criminal investigations and financial forensics.</li>
            <li>Coordination with National Central Bureaus (NCBs) and local Law Enforcement Agencies.</li>
            <li>Facilitating the recovery and restitution of fraudulent assets.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">4. Data Retention</h3>
          <p>
            Data is retained in accordance with the specific investigation requirements and the INTERPOL data retention framework. Encrypted archives are maintained to support ongoing global anti-fraud efforts.
          </p>
        </section>
      </div>
    </div>
  );
}

function TermsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold text-[#0A1628] mb-6 flex items-center gap-2">
        <Gavel className="text-[#003087]" /> Terms of Use & Cooperation
      </h2>
      <div className="space-y-6 text-[#4B5563] leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">1. Acceptance of Terms</h3>
          <p>
            By accessing this portal and filing a complaint, you agree to follow the guidelines established by the INTERPOL IGCI Division. Providing false or misleading information to an international law enforcement agency is a criminal offense in most jurisdictions.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">2. Portal Use Restrictions</h3>
          <p>You may not use this portal to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Intercept or attempt to intercept communications not intended for you.</li>
            <li>Use any automated system (bots, scrapers) to access the investigation database.</li>
            <li>Impersonate law enforcement officials or regulatory authorities.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">3. Intellectual Property</h3>
          <p>
            The INTERPOL logo, acronym, and the IGCI brand are protected internationally. Unauthorized use of these symbols for fraudulent certificates or communications is prohibited.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">4. Disclaimer of Liability</h3>
          <p>
            While IGCI uses advanced technology for fund recovery, INTERPOL does not guarantee the recovery of assets. We act as a coordination body and not as a commercial bank or financial insurer.
          </p>
        </section>
      </div>
    </div>
  );
}

function NoticeTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold text-[#0A1628] mb-6 flex items-center gap-2">
        <Scale className="text-[#003087]" /> Official Legal Notice
      </h2>
      <div className="space-y-6 text-[#4B5563] leading-relaxed">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
          <p className="text-amber-900 text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4" /> SCAM WARNING
          </p>
          <p className="text-amber-800 text-xs mt-1">
            Official INTERPOL officers will NEVER contact you requesting payment of any fee to release recovered funds. Our services are free of charge for victims.
          </p>
        </div>
        
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">Statutory Jurisdiction</h3>
          <p>
            The INTERPOL General Secretariat and the IGCI operate under the legal framework of the Constitution of INTERPOL. We maintain privileges and immunities as an international organization.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">Cooperation with NCBs</h3>
          <p>
            Investigations initiated on this platform are coordinated with National Central Bureaus. Legal actions and arrests are executed by national law enforcement based on INTERPOL colored notices and global intelligence.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-bold text-[#0A1628] mb-2">Asset Recovery Protocol</h3>
          <p>
            Recovered funds are held in secure escrow accounts pending verification of legal ownership. Asset disbursement is completed via secure channels verified by the cybercrime task force.
          </p>
        </section>
      </div>
    </div>
  );
}
