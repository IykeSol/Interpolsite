import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Menu,
  X,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";


export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      navigate("/admin");
      return;
    }
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "File a Complaint", path: "/complaint" },
    { label: "Track Your Case", path: "/track" },
    { label: "About Us", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
      {/* Top Bar — desktop full, mobile condensed */}
      <div className="bg-[#0A1628] text-gray-300 text-xs">
        {/* Desktop */}
        <div className="hidden md:block py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Emergency Hotline: +1 (800) IGCI-24/7
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                complaints@igci-interpol.int
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>INTERPOL Global Complex for Innovation</span>
            </div>
          </div>
        </div>
        {/* Mobile — single slim strip */}
        <div className="md:hidden flex items-center justify-center gap-3 py-1.5 px-4 text-center">
          <Phone className="w-3 h-3 shrink-0" />
          <span>+1 (800) IGCI-24/7</span>
          <span className="text-gray-600">|</span>
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate">complaints@igci-interpol.int</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogoClick}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-[#003087]/40"
                aria-label="INTERPOL IGCI"
              >
                <img
                  src="/images/loggo.png"
                  alt="INTERPOL IGCI Logo"
                  className="w-full h-full object-cover"
                />
              </button>
              <Link to="/" className="group">
                <div className="text-[#003087] tracking-widest text-xs font-semibold uppercase">
                  International Criminal Police Organization
                </div>
                <div className="text-[#0A1628] text-lg font-bold tracking-wide leading-none">
                  INTERPOL | IGCI
                </div>
              </Link>
            </div>

            {/* Desktop Nav — no admin link */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-[#003087] text-white"
                      : "text-[#0A1628] hover:bg-[#003087]/10 hover:text-[#003087]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded text-[#0A1628] hover:bg-gray-100"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-[#003087] text-white"
                    : "text-[#0A1628] hover:bg-gray-50"
                }`}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0A1628] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img src="/images/loggo.png" alt="INTERPOL IGCI Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-white font-bold text-base leading-none">INTERPOL</div>
                  <div className="text-xs text-[#C41230] font-semibold">IGCI Division</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                The INTERPOL Global Complex for Innovation (IGCI) leads global efforts against cybercrime and financial fraud.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-[#C41230] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links — admin removed */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "File a Complaint", path: "/complaint" },
                  { label: "Track Your Case", path: "/track" },
                  { label: "About IGCI", path: "/about" },
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="hover:text-white flex items-center gap-1.5 transition-colors">
                      <ChevronRight className="w-3 h-3 text-[#C41230]" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scam Types */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Scam Categories</h4>
              <ul className="space-y-2 text-sm">
                {[
                  "Investment Fraud",
                  "Cryptocurrency Fraud",
                  "Romance Scams",
                  "Phishing Attacks",
                  "Business Email Compromise",
                  "Tech Support Scams",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#C41230]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#C41230] mt-0.5 shrink-0" />
                  <span>Emergency Hotline<br /><span className="text-white">+1 (800) IGCI-247</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#C41230] mt-0.5 shrink-0" />
                  <span>Email<br /><span className="text-white">complaints@igci-interpol.int</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-[#C41230] mt-0.5 shrink-0" />
                  <span>Headquarters<br /><span className="text-white">Singapore, 10 Napier Road</span></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} INTERPOL Global Complex for Innovation. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/legal#terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/legal#legal" className="hover:text-white transition-colors">Legal Notice</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
