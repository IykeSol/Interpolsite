import { Shield, Phone, Mail, MapPin, Globe } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer style={{ background: "#06101f", borderTop: "3px solid #c9a227" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2" style={{ borderColor: "#c9a227", background: "rgba(201,162,39,0.15)" }}>
                <Shield className="w-5 h-5" style={{ color: "#c9a227" }} />
              </div>
              <div>
                <div className="text-white tracking-widest uppercase text-sm" style={{ fontWeight: 700 }}>INTERPOL IFR</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">Est. 1923</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The International Financial Recovery Division works tirelessly to track, freeze, and recover funds lost to fraud and financial crime worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4 uppercase tracking-widest text-xs" style={{ color: "#c9a227" }}>Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Report a Case", to: "/report" },
                { label: "Track Your Case", to: "/track" },
                { label: "About Us", to: "/about" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4 uppercase tracking-widest text-xs" style={{ color: "#c9a227" }}>Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#c9a227" }} />
                200 Quai Charles de Gaulle,<br />69006 Lyon, France
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#c9a227" }} />
                +33 4 72 44 70 00
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#c9a227" }} />
                ifr@interpol.int
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="w-4 h-4 shrink-0" style={{ color: "#c9a227" }} />
                www.interpol.int
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="mb-4 uppercase tracking-widest text-xs" style={{ color: "#c9a227" }}>Emergency Hotline</h4>
            <div className="rounded-lg p-4 border" style={{ background: "rgba(201,162,39,0.08)", borderColor: "rgba(201,162,39,0.3)" }}>
              <p className="text-white text-2xl mb-1" style={{ fontWeight: 700 }}>24 / 7</p>
              <p className="text-gray-300 text-sm mb-3">Available around the clock for urgent fraud cases</p>
              <p className="text-yellow-400 font-mono text-sm" style={{ fontWeight: 700 }}>+1 (800) INTERPOL</p>
            </div>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              For life-threatening situations, always contact your local emergency services first.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} INTERPOL International Financial Recovery Division. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            This portal is operated under INTERPOL General Regulations • Privacy Policy • Terms of Use
          </p>
        </div>
      </div>
    </footer>
  );
}
