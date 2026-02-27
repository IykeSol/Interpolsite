import { useNavigate } from "react-router";
import {
  Shield,
  AlertTriangle,
  Search,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Users,
  TrendingUp,
  FileText,
  Eye,
  Gavel,
  ChevronRight,
  Star,
} from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1605360846282-023d330bad8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBlbmZvcmNlbWVudCUyMGN5YmVyY3JpbWUlMjBpbnZlc3RpZ2F0aW9uJTIwZGFya3xlbnwxfHx8fDE3NzE4MzYwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const JUSTICE_IMAGE = "https://images.unsplash.com/photo-1757939056741-6a3e18923193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXN0aWNlJTIwc2NhbGVzJTIwY291cnRob3VzZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE4MzYwMzF8MA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { value: "195", label: "Member Countries", icon: Globe },
  { value: "94%", label: "Recovery Success Rate", icon: TrendingUp },
  { value: "12,400+", label: "Cases Resolved", icon: CheckCircle },
  { value: "$2.8B+", label: "Funds Recovered", icon: Lock },
];

const howItWorks = [
  {
    step: "01",
    icon: FileText,
    title: "File Your Complaint",
    desc: "Submit a detailed report of the scam including all known information about the fraudster and the transaction details.",
  },
  {
    step: "02",
    icon: Eye,
    title: "Investigation Begins",
    desc: "Our cybercrime specialists review your case, cross-reference global databases, and trace financial transactions.",
  },
  {
    step: "03",
    icon: Gavel,
    title: "Recovery & Justice",
    desc: "We coordinate with international agencies and financial institutions to freeze accounts and recover your funds.",
  },
];

const scamTypes = [
  { title: "Investment Fraud", icon: TrendingUp, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { title: "Cryptocurrency Scams", icon: Lock, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { title: "Romance Scams", icon: Users, color: "bg-pink-50 text-pink-700 border-pink-200" },
  { title: "Phishing Attacks", icon: AlertTriangle, color: "bg-red-50 text-red-700 border-red-200" },
  { title: "Business Email Fraud", icon: FileText, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { title: "Tech Support Scams", icon: Shield, color: "bg-green-50 text-green-700 border-green-200" },
];

const testimonials = [
  {
    name: "James M.",
    country: "United States",
    amount: "$38,500",
    text: "I lost my life savings to a fake crypto investment. INTERPOL IGCI recovered 85% of my funds within 3 months. Truly professional.",
    rating: 5,
  },
  {
    name: "Amina O.",
    country: "United Kingdom",
    amount: "£18,000",
    text: "After being scammed in a romance fraud, I thought the money was gone forever. The team was compassionate and thorough.",
    rating: 5,
  },
  {
    name: "Carlos M.",
    country: "Spain",
    amount: "€8,500",
    text: "The phishing scam drained my bank account overnight. IGCI traced the perpetrators and froze their accounts within days.",
    rating: 5,
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#003087]/85 to-[#0A1628]/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#C41230]/20 border border-[#C41230]/40 text-[#C41230] px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider mb-6">
              <Shield className="w-3.5 h-3.5" />
              INTERPOL Global Complex for Innovation
            </div>
            <h1 className="text-white mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
              Report Financial Fraud.
              <br />
              <span className="text-[#4A9EFF]">Recover Your Money.</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
              If you have been a victim of an online scam, investment fraud, or financial crime, our global team of cybercrime experts is here to investigate and help you recover your funds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/complaint")}
                className="flex items-center justify-center gap-2 bg-[#C41230] hover:bg-[#a30e28] text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5" />
                File a Complaint
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/track")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                Track Your Case
              </button>
            </div>
            <div className="flex items-center gap-2 mt-8 text-gray-400 text-sm">
              <Lock className="w-4 h-4 text-green-400" />
              <span>Your information is encrypted and handled with strict confidentiality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#003087] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-bold mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>{value}</div>
                <div className="text-blue-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="bg-amber-50 border-y border-amber-200 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mt-0.5">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-amber-900 font-semibold text-sm">
                Advisory Notice — February 2026: Rise in Cryptocurrency and AI-Generated Investment Fraud
              </p>
              <p className="text-amber-800 text-sm mt-0.5">
                INTERPOL IGCI is currently tracking a significant increase in AI-generated phishing campaigns and fake trading platforms. Do not share your wallet keys or banking credentials with anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-3">
              <ChevronRight className="w-4 h-4" />
              Our Process
            </div>
            <h2 className="text-[#0A1628] mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700 }}>
              How We Recover Your Money
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our systematic approach combines cutting-edge technology with global law enforcement cooperation to achieve results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#003087] to-[#C41230]" />

            {howItWorks.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-[#F5F6FA] rounded-xl p-8 text-center relative hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#C41230] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {step}
                </div>
                <div className="w-16 h-16 bg-[#003087] rounded-xl flex items-center justify-center mx-auto mb-5 mt-3">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-[#0A1628] mb-3" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Types */}
      <section className="py-20 bg-[#F5F6FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-3">
              <ChevronRight className="w-4 h-4" />
              Fraud Categories
            </div>
            <h2 className="text-[#0A1628] mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700 }}>
              Types of Fraud We Investigate
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We handle all forms of financial and digital fraud with specialised investigators dedicated to each category.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {scamTypes.map(({ title, icon: Icon, color }) => (
              <div key={title} className={`border rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform duration-200 bg-white ${color.split(" ")[2]}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${color.split(" ")[0]} ${color.split(" ")[1]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[#0A1628] font-semibold text-sm">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-4">
                <ChevronRight className="w-4 h-4" />
                About IGCI
              </div>
              <h2 className="text-[#0A1628] mb-5" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700 }}>
                A Global Force Against Financial Crime
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                The INTERPOL Global Complex for Innovation (IGCI) is a cutting-edge research and development facility that serves as a global hub for capacity building, innovation, and operational support against cybercrime and financial fraud.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With partners in 195 countries, we leverage international cooperation, advanced digital forensics, and financial intelligence to pursue justice for victims of online scams worldwide.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Globe, label: "195 Country Network" },
                  { icon: Shield, label: "24/7 Cyber Response" },
                  { icon: Lock, label: "Encrypted Case Files" },
                  { icon: Users, label: "Multilingual Support" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#003087]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#003087]" />
                    </div>
                    <span className="text-[#0A1628] text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 text-[#003087] font-semibold hover:text-[#C41230] transition-colors"
              >
                Learn More About IGCI <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <img
                src={JUSTICE_IMAGE}
                alt="Justice and Law"
                className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#C41230] text-white rounded-xl p-5 shadow-xl hidden md:block">
                <div className="text-3xl font-bold">$2.8B+</div>
                <div className="text-sm text-red-100">Total Funds Recovered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#C41230] text-xs font-semibold uppercase tracking-wider mb-3">
              <ChevronRight className="w-4 h-4" />
              Victim Testimonials
            </div>
            <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700 }}>
              Lives We Have Helped Restore
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.country}</div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-semibold">
                    Recovered {t.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#003087]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
            Have You Been a Victim of Financial Fraud?
          </h2>
          <p className="text-blue-200 mb-8 text-base max-w-2xl mx-auto">
            Do not wait. The faster you report, the higher the chance of recovering your funds. Our experts are ready to begin your investigation immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/complaint")}
              className="flex items-center justify-center gap-2 bg-[#C41230] hover:bg-[#a30e28] text-white px-8 py-4 rounded font-semibold transition-all duration-200 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              File a Complaint Now
            </button>
            <button
              onClick={() => navigate("/track")}
              className="flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded font-semibold transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              Track Existing Case
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
