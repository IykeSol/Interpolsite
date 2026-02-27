import { useNavigate } from "react-router";
import {
  Shield,
  Globe,
  Lock,
  Users,
  TrendingUp,
  FileText,
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Gavel,
  Eye,
  Cpu,
} from "lucide-react";

// LOCAL IMAGE — drop your photo into public/images/ with this exact filename:
//   public/images/security.jpg  — digital security / blue tech / financial fraud investigation photo
const SECURITY_IMAGE = "/images/security.jpg";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.target as HTMLImageElement).style.display = "none";
};

const divisions = [
  {
    icon: Cpu,
    title: "Cybercrime Division",
    desc: "Specialised unit targeting ransomware, phishing, malware, and darknet criminal networks operating across borders.",
  },
  {
    icon: TrendingUp,
    title: "Financial Crimes Unit",
    desc: "Expert forensic accountants and financial investigators tracing money laundering and international fraud schemes.",
  },
  {
    icon: Globe,
    title: "Digital Forensics Lab",
    desc: "State-of-the-art laboratory analysing digital evidence from devices, networks, and blockchain transactions.",
  },
  {
    icon: Gavel,
    title: "Legal Affairs Office",
    desc: "Coordinating with prosecutors and courts in 195 countries to ensure criminal prosecution of offenders.",
  },
  {
    icon: Eye,
    title: "Threat Intelligence",
    desc: "Monitoring emerging fraud trends, threat actor profiles, and new criminal methodologies in real time.",
  },
  {
    icon: Users,
    title: "Victim Support Services",
    desc: "Providing psychological support, legal guidance, and regular updates to fraud victims throughout the process.",
  },
];

const milestones = [
  { year: "2014", event: "IGCI established in Singapore as INTERPOL's cybercrime innovation hub" },
  { year: "2017", event: "Launched Operation Goldfish Alpha — disrupted major crypto fraud network" },
  { year: "2019", event: "Digital Assets Recovery Task Force created" },
  { year: "2021", event: "First billion dollars in fraud funds recovered globally" },
  { year: "2023", event: "AI-enhanced fraud detection system deployed across 80 member countries" },
  { year: "2025", event: "Online Fraud Complaint Portal launched for direct victim reporting" },
];

export function About() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#003087] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <ChevronRight className="w-4 h-4" />
            About INTERPOL IGCI
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>
            The Global Hub for Fighting Financial Crime
          </h1>
          <p className="text-blue-200 text-base max-w-2xl mx-auto leading-relaxed">
            INTERPOL's Global Complex for Innovation leads the international community in addressing cybercrime and financial fraud through innovation, partnership, and relentless pursuit of justice.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-4">
                <ChevronRight className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-[#0A1628] mb-5" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}>
                Connecting Global Law Enforcement to Protect Victims
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The INTERPOL Global Complex for Innovation (IGCI) serves as the nexus of global cybercrime and financial fraud investigations. Established in Singapore, IGCI bridges law enforcement agencies from 195 member countries to coordinate responses to transnational financial crimes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our mandate covers prevention, investigation, and recovery — using the latest digital forensics, AI-powered threat analysis, and a global network of financial intelligence units to trace and recover funds stolen through fraud.
              </p>
              <ul className="space-y-3">
                {[
                  "International cooperation across 195 member nations",
                  "Advanced digital forensics and blockchain tracing",
                  "Real-time financial transaction monitoring",
                  "Victim-centred approach to fund recovery",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={SECURITY_IMAGE} alt="Digital Security" className="rounded-2xl shadow-xl w-full object-cover h-[380px]" loading="lazy" onError={handleImgError} />
              <div className="absolute -top-4 -right-4 bg-[#003087] text-white rounded-xl p-4 shadow-xl hidden md:block text-center">
                <div className="font-bold text-2xl">195</div>
                <div className="text-blue-200 text-xs">Member Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="py-20 bg-[#F5F6FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-3">
              <ChevronRight className="w-4 h-4" />
              Our Structure
            </div>
            <h2 className="text-[#0A1628] mb-3" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}>
              Specialised Divisions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {divisions.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#003087]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#003087]" />
                </div>
                <h3 className="text-[#0A1628] mb-2" style={{ fontWeight: 700, fontSize: "1rem" }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-3">
              <ChevronRight className="w-4 h-4" />
              Our History
            </div>
            <h2 className="text-[#0A1628] mb-3" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}>
              A Decade of Fighting Financial Crime
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#003087]/20" />
            <div className="space-y-6">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-6 relative">
                  <div className="w-16 shrink-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#003087] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10 relative">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#F5F6FA] rounded-xl p-4">
                    <div className="text-[#C41230] font-bold text-sm mb-1">{year}</div>
                    <div className="text-[#0A1628] text-sm">{event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}>
            Our Core Values
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Shield, label: "Integrity" },
              { icon: Globe, label: "Cooperation" },
              { icon: Lock, label: "Confidentiality" },
              { icon: FileText, label: "Transparency" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                <Icon className="w-8 h-8 text-[#4A9EFF] mx-auto mb-3" />
                <div className="text-white font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#003087]">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "clamp(1.3rem, 3vw, 1.7rem)" }}>
            Ready to Report a Fraud?
          </h2>
          <p className="text-blue-200 mb-6 text-sm">
            Our team is ready to investigate your case and help recover your funds.
          </p>
          <button
            onClick={() => navigate("/complaint")}
            className="flex items-center gap-2 bg-[#C41230] hover:bg-[#a30e28] text-white px-8 py-3 rounded-lg font-semibold transition-colors mx-auto"
          >
            File a Complaint
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
