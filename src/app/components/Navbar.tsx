import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Shield, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Report a Case", path: "/report" },
    { label: "Track Your Case", path: "/track" },
    { label: "About", path: "/about" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 shadow-lg" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2149 100%)" }}>
      {/* Top bar */}
      <div className="border-b border-white/10 py-1.5" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="text-xs text-gray-400 tracking-wider uppercase">
            International Financial Recovery Division
          </span>
          <span className="text-xs text-gray-400">
            24/7 Hotline: <span style={{ color: "#c9a227" }}>+1 (800) INTERPOL</span>
          </span>
        </div>
      </div>
      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2" style={{ borderColor: "#c9a227", background: "rgba(201,162,39,0.15)" }}>
              <Shield className="w-7 h-7" style={{ color: "#c9a227" }} />
            </div>
          </div>
          <div>
            <div className="text-white tracking-[0.15em] uppercase" style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em" }}>
              INTERPOL <span style={{ color: "#c9a227" }}>IFR</span>
            </div>
            <div className="text-gray-400" style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              International Fraud Recovery
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-2 rounded text-sm tracking-wide transition-all duration-200"
              style={{
                color: isActive(link.path) ? "#c9a227" : "#d1d5db",
                background: isActive(link.path) ? "rgba(201,162,39,0.12)" : "transparent",
                borderBottom: isActive(link.path) ? "2px solid #c9a227" : "2px solid transparent",
                fontWeight: isActive(link.path) ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => navigate("/admin")}
            className="ml-4 px-5 py-2 rounded text-sm tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "#c9a227", color: "#0a1628", fontWeight: 700 }}
          >
            Investigator Portal
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 pb-4" style={{ background: "#0d2149" }}>
          <div className="flex flex-col px-4 pt-2 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-3 rounded text-sm"
                style={{
                  color: isActive(link.path) ? "#c9a227" : "#d1d5db",
                  background: isActive(link.path) ? "rgba(201,162,39,0.12)" : "transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { navigate("/admin"); setMobileOpen(false); }}
              className="mt-2 px-5 py-3 rounded text-sm tracking-wider uppercase"
              style={{ background: "#c9a227", color: "#0a1628", fontWeight: 700 }}
            >
              Investigator Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
